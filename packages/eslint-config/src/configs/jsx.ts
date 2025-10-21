import { GLOB_JSX, GLOB_TSX } from "@/globs";
import { ensurePackages, interopDefault, isObject } from "@/utils";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";

const jsx = async (options: ExtractOptions<OptionsConfig["jsx"]> = {}): Promise<TypedFlatConfigItem[]> => {
	const { a11y = false, overrides } = options;

	await ensurePackages([a11y ? "eslint-plugin-jsx-a11y" : undefined]);

	const eslintPluginJsxA11y = a11y ? await interopDefault(import("eslint-plugin-jsx-a11y")) : undefined;

	const config: TypedFlatConfigItem[] = [];

	const files = [GLOB_JSX, GLOB_TSX];

	config.push({
		files,

		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},

		name: "zayne/jsx/setup",
	});

	if (a11y && eslintPluginJsxA11y) {
		config.push(
			{
				name: "zayne/jsx/a11y/setup",

				plugins: {
					"jsx-a11y": eslintPluginJsxA11y,
				},
			},

			{
				files,

				name: "zayne/jsx/a11y/recommended",

				rules: eslintPluginJsxA11y.flatConfigs.recommended.rules,
			},

			{
				files,

				name: "zayne/jsx/a11y/rules",

				rules: {
					...overrides,
					...(isObject(a11y) && a11y.overrides),
				},
			}
		);
	}

	return config;
};

export { jsx };
