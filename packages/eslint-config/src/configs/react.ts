import { fixupPluginRules } from "@eslint/compat";
import { isObject } from "@zayne-labs/toolkit-type-helpers";
import { isPackageExists } from "local-pkg";
import {
	allowedNextJsExportNames,
	allowedReactRouterExportNames,
	defaultPluginRenameMap,
} from "@/constants";
import { GLOB_SRC } from "@/globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, renamePlugins, renameRules } from "@/utils";

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
		nextjs = isUsingNext,
		overrides,
		react: enableReact = true,
		refresh = true,
		typescript = true,
	} = options;

	await ensurePackages([
		"@eslint-react/eslint-plugin",
		"eslint-plugin-react-hooks",
		refresh ? "eslint-plugin-react-refresh" : undefined,
		nextjs ? "@next/eslint-plugin-next" : undefined,
	]);

	const [eslintPluginReact, eslintReactHooks, eslintPluginReactRefresh, eslintPluginNextjs] =
		await Promise.all([
			enableReact ? interopDefault(import("@eslint-react/eslint-plugin")) : undefined,
			enableReact ? interopDefault(import("eslint-plugin-react-hooks")) : undefined,
			refresh ? interopDefault(import("eslint-plugin-react-refresh")) : undefined,
			nextjs ? interopDefault(import("@next/eslint-plugin-next")) : undefined,
		]);

	// prettier-ignore
	const recommendedReactConfig = eslintPluginReact?.configs[typescript ? "recommended-type-checked" : "recommended"];

	const config: TypedFlatConfigItem[] = [];

	if (enableReact && recommendedReactConfig && eslintReactHooks) {
		config.push(
			{
				name: "zayne/react/setup",

				plugins: {
					...renamePlugins(recommendedReactConfig.plugins, defaultPluginRenameMap),
					"react-hooks": eslintReactHooks,
				},

				settings: recommendedReactConfig.settings,
			},

			{
				files,

				languageOptions: {
					parserOptions: {
						ecmaFeatures: {
							jsx: true,
						},

						sourceType: "module",

						...(typescript && {
							// eslint-disable-next-line unicorn/no-await-expression-member -- ignore for now
							parser: (await interopDefault(import("typescript-eslint"))).parser,
						}),
					},
				},

				name: "zayne/react/setup-processor",
			},

			{
				files,

				name: "zayne/react/recommended",

				rules: renameRules(recommendedReactConfig.rules, defaultPluginRenameMap),
			},

			{
				files,

				name: "zayne/react/rules",

				rules: {
					// Hook Extra rules
					"react-hooks-extra/no-unnecessary-use-callback": "warn",
					"react-hooks-extra/no-unnecessary-use-memo": "warn",
					"react-hooks-extra/no-unnecessary-use-prefix": "error",
					"react-hooks-extra/prefer-use-state-lazy-initialization": "error",

					// Hook rules
					"react-hooks/exhaustive-deps": "warn",
					"react-hooks/rules-of-hooks": "error",

					// Naming convention rules
					"react-naming-convention/component-name": "warn",
					"react-naming-convention/use-state": "off",

					// Regular React rules
					"react/avoid-shorthand-boolean": "error",
					"react/function-component-definition": "off",
					"react/no-array-index-key": "error",
					"react/no-children-count": "off",
					"react/no-children-only": "off",
					"react/no-children-prop": "error",
					"react/no-clone-element": "off",
					"react/no-complex-conditional-rendering": "warn",
					"react/no-missing-component-display-name": "error",
					"react/no-useless-fragment": "error",
					"react/prefer-destructuring-assignment": "error",
					"react/prefer-read-only-props": "off",
					"react/prefer-shorthand-fragment": "error",

					...overrides,
					...(isObject(enableReact) && enableReact.overrides),
				},
			}
		);
	}

	if (refresh && eslintPluginReactRefresh) {
		config.push({
			files,

			name: "zayne/react/refresh",

			plugins: {
				"react-refresh": eslintPluginReactRefresh,
			},

			rules: {
				"react-refresh/only-export-components": [
					"warn",
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(isUsingNext ? allowedNextJsExportNames : []),
							...(isUsingReactRouter ? allowedReactRouterExportNames : []),
						],
					},
				],

				...overrides,
				...(isObject(refresh) && refresh.overrides),
			},
		});
	}

	if (compiler) {
		config.push({
			files,

			name: "zayne/react/compiler",

			rules: {
				"react-hooks/react-compiler": "error",

				...overrides,
				...(isObject(compiler) && compiler.overrides),
			},
		});
	}

	if (nextjs && eslintPluginNextjs) {
		config.push({
			files,

			name: "zayne/react/nextjs",

			plugins: {
				"nextjs-next": fixupPluginRules(eslintPluginNextjs),
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

					...overrides,
					...(isObject(nextjs) && nextjs.overrides),
				},
				defaultPluginRenameMap
			),
		});
	}

	return config;
};

export { react };
