import { isObject } from "@zayne-labs/toolkit-type-helpers";
import type { Linter } from "eslint";
import { isPackageExists } from "local-pkg";
import {
	getDefaultAllowedNextJsExportNames,
	getDefaultAllowedReactRouterExportNames,
	getDefaultPluginRenameMap,
} from "../constants/defaults";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault, renamePlugins, renameRules } from "../utils";

// React refresh
const ReactRefreshAllowConstantExportPackages = ["vite"];
const ReactRouterPackages = [
	"@react-router/node",
	"@react-router/react",
	"@react-router/serve",
	"@react-router/dev",
];
const NextJsPackages = ["next"];

const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some((i) => isPackageExists(i));
const isUsingReactRouter = ReactRouterPackages.some((i) => isPackageExists(i));
const isUsingNext = NextJsPackages.some((i) => isPackageExists(i));

// Hold the reference so we don't redeclare the plugin on each call
let eslintPluginReactPlugins: NonNullable<Linter.Config["plugins"]> | undefined;

const react = async (
	options: ExtractOptions<OptionsConfig["react"]> = {}
	// eslint-disable-next-line complexity -- Ignore
): Promise<TypedFlatConfigItem[]> => {
	const {
		compiler = true,
		files = [GLOB_SRC],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		nextjs = isUsingNext,
		overrides,
		react: enableReact = true,
		refresh = true,
		typescript = true,
		youMightNotNeedAnEffect = true,
	} = options;

	await ensurePackages([
		enableReact ? "@eslint-react/eslint-plugin" : undefined,
		enableReact ? "eslint-plugin-react-hooks" : undefined,
		refresh ? "eslint-plugin-react-refresh" : undefined,
		youMightNotNeedAnEffect ? "eslint-plugin-react-you-might-not-need-an-effect" : undefined,
		nextjs ? "@next/eslint-plugin-next" : undefined,
	]);

	const [
		eslintPluginReact,
		eslintPluginCustomJsxRules,
		eslintReactHooks,
		eslintPluginReactRefresh,
		eslintPluginReactYouMightNotNeedAnEffect,
		eslintPluginNextjs,
	] = await Promise.all([
		enableReact ? interopDefault(import("@eslint-react/eslint-plugin")) : undefined,
		enableReact ? interopDefault(import("../rules/react/jsxRules")) : undefined,
		enableReact ? interopDefault(import("eslint-plugin-react-hooks")) : undefined,
		refresh ? interopDefault(import("eslint-plugin-react-refresh")) : undefined,
		youMightNotNeedAnEffect ?
			interopDefault(import("eslint-plugin-react-you-might-not-need-an-effect"))
		:	undefined,
		nextjs ? interopDefault(import("@next/eslint-plugin-next")) : undefined,
	]);

	const strictReactConfigKey = typescript ? "strict-type-checked" : "strict";

	const strictUnofficialReactConfig = eslintPluginReact?.configs[strictReactConfigKey];

	const getMergedReactPlugin = () => {
		if (eslintPluginReactPlugins) {
			return eslintPluginReactPlugins;
		}

		eslintPluginReactPlugins = renamePlugins(
			strictUnofficialReactConfig?.plugins,
			getDefaultPluginRenameMap()
		);

		const mainReactPlugin = eslintPluginReactPlugins?.react;

		const customJsxPlugin = eslintPluginCustomJsxRules?.getCustomJsxPlugin();

		if (mainReactPlugin?.rules && customJsxPlugin?.rules) {
			Object.assign(mainReactPlugin.rules, customJsxPlugin.rules);
		}

		return eslintPluginReactPlugins;
	};

	const config: TypedFlatConfigItem[] = [
		{
			languageOptions: {
				parserOptions: {
					ecmaFeatures: { jsx: true },
					sourceType: "module",
				},
			},

			name: "zayne/react/setup",

			plugins: {
				...(strictUnofficialReactConfig && getMergedReactPlugin()),
				...(eslintReactHooks && {
					"react-hooks": eslintReactHooks,
				}),
				...(eslintPluginReactRefresh && {
					"react-refresh": eslintPluginReactRefresh,
				}),
				...(eslintPluginReactYouMightNotNeedAnEffect && {
					"react-you-might-not-need-an-effect": eslintPluginReactYouMightNotNeedAnEffect,
				}),
				...(eslintPluginNextjs && {
					nextjs: eslintPluginNextjs,
				}),
			},
		},
	];

	if (enableReact && strictUnofficialReactConfig && eslintReactHooks) {
		config.push(
			{
				files,

				name: "zayne/react/official/rules",

				rules: {
					"react-hooks/exhaustive-deps": "off", // Handled by react-x
					"react-hooks/rules-of-hooks": "off", // Handled by react-x
				},
			},

			{
				files: typescript ? filesTypeAware : files,

				...(typescript && { ignores: ignoresTypeAware }),

				name: `zayne/react/unofficial/${strictReactConfigKey}`,

				rules: renameRules(strictUnofficialReactConfig.rules, getDefaultPluginRenameMap()),

				settings: strictUnofficialReactConfig.settings,
			},

			{
				files,

				name: "zayne/react/unofficial/rules",

				rules: {
					"react/jsx-shorthand-boolean": "error",
					"react/jsx-shorthand-fragment": "warn",

					"react/no-children-count": "off",
					"react/no-children-only": "off",
					"react/no-clone-element": "off",

					/* eslint-disable perfectionist/sort-objects -- Allow */
					"react/exhaustive-deps": "warn",
					"react/rules-of-hooks": "error",
					/* eslint-enable perfectionist/sort-objects -- Allow */

					...overrides,
					...(isObject(enableReact) && enableReact.overrides),
				},
			}
		);
	}

	if (compiler && eslintPluginReact) {
		config.push({
			files,

			name: "zayne/react/official/compiler/rules",

			rules: {
				"react-hooks/capitalized-calls": "error",
				"react-hooks/config": "error",
				"react-hooks/error-boundaries": "error",
				"react-hooks/gating": "error",
				"react-hooks/globals": "error",
				"react-hooks/hooks": "error", // Covers more cases than react-x/rule-of-hooks
				"react-hooks/immutability": "error",
				"react-hooks/incompatible-library": "warn",
				"react-hooks/no-deriving-state-in-effects": "error",
				"react-hooks/preserve-manual-memoization": "warn",
				"react-hooks/purity": "warn",
				"react-hooks/refs": "error",
				"react-hooks/rule-suppression": "off", // Too annoying
				"react-hooks/set-state-in-effect": "off", // Handled by react-x
				"react-hooks/set-state-in-render": "error",
				"react-hooks/static-components": "error",
				"react-hooks/syntax": "error",
				"react-hooks/todo": "warn",
				"react-hooks/unsupported-syntax": "warn",
				"react-hooks/use-memo": "warn",

				...overrides,
				...(isObject(compiler) && compiler.overrides),
			},
		});
	}

	if (refresh && eslintPluginReactRefresh) {
		config.push({
			files: isObject(refresh) && refresh.files ? refresh.files : files,

			name: "zayne/react/refresh/rules",

			rules: {
				"react-refresh/only-export-components": [
					"warn",
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(nextjs ? getDefaultAllowedNextJsExportNames() : []),
							...(isUsingReactRouter ? getDefaultAllowedReactRouterExportNames() : []),
						],
					},
				],

				...overrides,
				...(isObject(refresh) && refresh.overrides),
			},
		});
	}

	if (youMightNotNeedAnEffect && eslintPluginReactYouMightNotNeedAnEffect) {
		config.push(
			{
				files,

				name: "zayne/react/you-might-not-need-an-effect/recommended",

				rules: eslintPluginReactYouMightNotNeedAnEffect.configs.recommended.rules,
			},

			{
				files,

				name: "zayne/react/you-might-not-need-an-effect/rules",

				rules: {
					...overrides,
					...(isObject(youMightNotNeedAnEffect) && youMightNotNeedAnEffect.overrides),
				},
			}
		);
	}

	if (nextjs && eslintPluginNextjs) {
		config.push(
			{
				files: isObject(nextjs) && nextjs.files ? nextjs.files : files,

				name: "zayne/react/nextjs/recommended",

				rules: renameRules(
					{
						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...(eslintPluginNextjs.configs?.recommended?.rules as Record<string, never>),
						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...(eslintPluginNextjs.configs?.["core-web-vitals"]?.rules as Record<string, never>),
					},
					getDefaultPluginRenameMap()
				),
			},
			{
				files: isObject(nextjs) && nextjs.files ? nextjs.files : files,

				name: "zayne/react/nextjs/rules",

				rules: {
					...overrides,
					...(isObject(nextjs) && nextjs.overrides),
				},
			}
		);
	}

	return config;
};

export { react };
