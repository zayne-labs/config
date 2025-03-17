import type {
	OptionsHasTypeScript,
	OptionsOverrides,
	OptionsStylistic,
	TypedFlatConfigItem,
} from "@/types";
import { interopDefault } from "@/utils";

const imports = async (
	options: OptionsHasTypeScript & OptionsOverrides & OptionsStylistic = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, stylistic = true, typescript = true } = options;

	const eslintPluginImportX = await interopDefault(import("eslint-plugin-import-x"));

	return [
		{
			name: "zayne/import/setup",

			plugins: {
				import: eslintPluginImportX,
			},

			...(typescript && { settings: eslintPluginImportX.flatConfigs.typescript.settings }),
		},

		{
			name: "zayne/import/recommended",

			rules: {
				...eslintPluginImportX.flatConfigs.recommended.rules,
				...(typescript && eslintPluginImportX.flatConfigs.typescript.rules),
			},
		},

		{
			name: "zayne/import/rules",

			rules: {
				"import/extensions": [
					"error",
					"never",
					{ ignorePackages: true, pattern: { png: "always", svg: "always" } },
				],
				"import/first": "error",
				"import/no-absolute-path": "error",
				"import/no-cycle": ["error", { ignoreExternal: true, maxDepth: 3 }],
				"import/no-duplicates": "error",
				"import/no-extraneous-dependencies": ["error", { devDependencies: true }],
				"import/no-mutable-exports": "error",
				"import/no-named-default": "error",
				"import/no-relative-packages": "error",
				"import/no-self-import": "error",
				"import/no-unresolved": "off",
				"import/no-useless-path-segments": ["error", { commonjs: true }],
				"import/no-webpack-loader-syntax": "error",

				...(stylistic && { "import/newline-after-import": "error" }),

				...overrides,
			},
		},
	];
};

export { imports };
