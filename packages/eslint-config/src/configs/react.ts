import { isObject } from "@zayne-labs/toolkit-type-helpers";
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
		eslintReactHooks,
		eslintPluginReactRefresh,
		eslintPluginReactYouMightNotNeedAnEffect,
		eslintPluginNextjs,
	] = await Promise.all([
		enableReact ? interopDefault(import("@eslint-react/eslint-plugin")) : undefined,
		enableReact ? interopDefault(import("eslint-plugin-react-hooks")) : undefined,
		refresh ? interopDefault(import("eslint-plugin-react-refresh")) : undefined,
		youMightNotNeedAnEffect ?
			interopDefault(import("eslint-plugin-react-you-might-not-need-an-effect"))
		:	undefined,
		nextjs ? interopDefault(import("@next/eslint-plugin-next")) : undefined,
	]);

	const strictConfigKey = typescript ? "strict-type-checked" : "strict";

	const strictReactConfig = eslintPluginReact?.configs[strictConfigKey] as
		| (NonNullable<typeof eslintPluginReact>["configs"][typeof strictConfigKey] & {
				plugins: Record<string, unknown> | undefined;
		  })
		| undefined;

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
				...(strictReactConfig
					&& renamePlugins(strictReactConfig.plugins, getDefaultPluginRenameMap())),
				...(eslintReactHooks && { "react-hooks": eslintReactHooks }),
				...(eslintPluginReactRefresh && { "react-refresh": eslintPluginReactRefresh }),
				...(eslintPluginReactYouMightNotNeedAnEffect && {
					"react-you-might-not-need-an-effect": eslintPluginReactYouMightNotNeedAnEffect,
				}),
				...(eslintPluginNextjs && { nextjs: eslintPluginNextjs }),
			},
		},
	];

	if (enableReact && strictReactConfig && eslintReactHooks) {
		config.push(
			{
				files,

				name: "zayne/react/official/rules",

				rules: {
					"react-hooks/exhaustive-deps": "warn",
					"react-hooks/rules-of-hooks": "error",
				},
			},

			{
				files: typescript ? filesTypeAware : files,

				...(typescript && { ignores: ignoresTypeAware }),

				name: `zayne/react/unofficial/${strictConfigKey}`,

				rules: renameRules(strictReactConfig.rules, getDefaultPluginRenameMap()),

				settings: strictReactConfig.settings,
			},

			{
				files,

				name: "zayne/react/unofficial/rules",

				rules: {
					// React official plugin now offers this directly, so turn it off
					"react-hooks-extra/no-direct-set-state-in-use-effect": "off",

					// Naming convention rules
					"react-naming-convention/component-name": "warn",
					"react-naming-convention/use-state": "off",

					// Regular React rules
					"react-x/jsx-shorthand-boolean": ["error", -1],
					"react-x/jsx-shorthand-fragment": "warn",
					"react-x/no-children-count": "off",
					"react-x/no-children-only": "off",
					"react-x/no-clone-element": "off",
					"react-x/no-implicit-key": "off",
					"react-x/no-missing-component-display-name": "warn",
					"react-x/prefer-read-only-props": "off",

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
				"react-hooks/hooks": "error",
				"react-hooks/immutability": "error",
				"react-hooks/incompatible-library": "warn",
				"react-hooks/no-deriving-state-in-effects": "error",
				"react-hooks/preserve-manual-memoization": "warn",
				"react-hooks/purity": "warn",
				"react-hooks/refs": "error",
				"react-hooks/rule-suppression": "warn",
				"react-hooks/set-state-in-effect": "warn",
				"react-hooks/set-state-in-render": "error",
				"react-hooks/static-components": "warn",
				"react-hooks/syntax": "error",
				"react-hooks/todo": "error",
				"react-hooks/unsupported-syntax": "error",
				"react-hooks/use-memo": "warn",

				...overrides,
				...(isObject(compiler) && compiler.overrides),
			},
		});
	}

	if (refresh && eslintPluginReactRefresh) {
		config.push({
			files,

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
				files,

				name: "zayne/react/nextjs/recommended",

				rules: renameRules(
					{
						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...(eslintPluginNextjs.configs?.recommended?.rules as Record<string, unknown>),
						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...(eslintPluginNextjs.configs?.["core-web-vitals"]?.rules as Record<string, unknown>),
					},
					getDefaultPluginRenameMap()
				),
			},
			{
				files,

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
