import {
	allowedNextJsExportNames,
	allowedReactRouterExportNames,
	defaultPluginRenameMap,
} from "../constants";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault, renamePlugins, renameRules } from "../utils";
import { isObject } from "@zayne-labs/toolkit-type-helpers";
import { isPackageExists } from "local-pkg";

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
): Promise<TypedFlatConfigItem[]> => {
	const {
		compiler = false,
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
		"@eslint-react/eslint-plugin",
		"eslint-plugin-react-hooks",
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

	// prettier-ignore
	const recommendedReactConfig = eslintPluginReact?.configs[typescript ? "recommended-type-checked" : "recommended"];

	const config: TypedFlatConfigItem[] = [];

	if (enableReact && recommendedReactConfig && eslintReactHooks) {
		config.push(
			{
				files,

				languageOptions: {
					parserOptions: {
						ecmaFeatures: { jsx: true },
						sourceType: "module",
					},
				},

				name: "zayne/react/setup",

				plugins: {
					...renamePlugins(recommendedReactConfig.plugins, defaultPluginRenameMap),
					"react-hooks": eslintReactHooks,
					"react-you-might-not-need-an-effect": eslintPluginReactYouMightNotNeedAnEffect,
				},

				settings: recommendedReactConfig.settings,
			},

			{
				files: typescript ? filesTypeAware : files,

				...(typescript && { ignores: ignoresTypeAware }),

				name: `zayne/react/${typescript ? "recommended-type-checked" : "recommended"}`,

				rules: renameRules(recommendedReactConfig.rules, defaultPluginRenameMap),
			},

			{
				files,

				name: "zayne/react/rules",

				rules: {
					// Hook rules
					"react-hooks/exhaustive-deps": "warn",
					"react-hooks/rules-of-hooks": "error",

					// Naming convention rules
					"react-naming-convention/component-name": "warn",
					"react-naming-convention/use-state": "off",

					// Regular React rules
					"react-x/jsx-shorthand-boolean": ["error", -1],
					"react-x/jsx-shorthand-fragment": "error",
					"react-x/no-array-index-key": "error",
					"react-x/no-children-count": "off",
					"react-x/no-children-only": "off",
					"react-x/no-children-prop": "error",
					"react-x/no-clone-element": "off",
					"react-x/no-missing-component-display-name": "error",
					"react-x/no-unnecessary-use-callback": "warn",
					"react-x/no-unnecessary-use-memo": "warn",
					"react-x/no-unnecessary-use-prefix": "error",
					"react-x/no-useless-fragment": "error",
					"react-x/prefer-destructuring-assignment": "error",
					"react-x/prefer-read-only-props": "off",
					"react-x/prefer-use-state-lazy-initialization": "error",

					...overrides,
					...(isObject(enableReact) && enableReact.overrides),
				},
			}
		);
	}

	if (refresh && eslintPluginReactRefresh) {
		config.push({
			files,

			name: "zayne/react/refresh/rules",

			plugins: {
				"react-refresh": eslintPluginReactRefresh,
			},

			rules: {
				"react-refresh/only-export-components": [
					"warn",
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(nextjs ? allowedNextJsExportNames : []),
							...(isUsingReactRouter ? allowedReactRouterExportNames : []),
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

				plugins: {
					"react-you-might-not-need-an-effect": eslintPluginReactYouMightNotNeedAnEffect,
				},

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

	if (compiler) {
		config.push({
			files,

			name: "zayne/react/compiler/rules",

			rules: {
				"react-hooks/react-compiler": "error",

				...overrides,
				...(isObject(compiler) && compiler.overrides),
			},
		});
	}

	if (nextjs && eslintPluginNextjs) {
		config.push(
			{
				files,

				name: "zayne/react/nextjs/recommended",

				plugins: {
					nextjs: eslintPluginNextjs,
				},

				rules: renameRules(
					// eslint-disable-next-line ts-eslint/no-unsafe-argument -- missing types
					{
						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...eslintPluginNextjs.configs?.recommended?.rules,

						// @ts-expect-error -- missing types
						// eslint-disable-next-line ts-eslint/no-unsafe-member-access -- missing types
						...eslintPluginNextjs.configs?.["core-web-vitals"]?.rules,
					},
					defaultPluginRenameMap
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
