import { interopDefault } from "@/utils";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";

export const unicorn = async (
	options: ExtractOptions<OptionsConfig["unicorn"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, type = "app" } = options;

	const eslintPluginUnicorn = await interopDefault(import("eslint-plugin-unicorn"));

	return [
		{
			...eslintPluginUnicorn.configs.recommended,
			name: "zayne/unicorn/recommended",
		},

		{
			name: "zayne/unicorn/rules",

			rules: {
				"unicorn/filename-case": [
					"warn",
					{
						cases: {
							camelCase: true,
							kebabCase: true,
							pascalCase: true,
						},
					},
				],

				...(type === "app" ?
					{
						"unicorn/prefer-global-this": "off",
					}
				:	{
						"unicorn/prefer-global-this": "warn",
					}),

				"unicorn/new-for-builtins": "off",
				"unicorn/no-array-for-each": "off",
				"unicorn/no-array-reduce": "off",
				"unicorn/no-negated-condition": "off",
				"unicorn/no-null": "off",
				"unicorn/no-useless-undefined": ["error", { checkArguments: true }],
				"unicorn/numeric-separators-style": "off",
				"unicorn/prevent-abbreviations": "off",

				...overrides,
			},
		},
	];
};
