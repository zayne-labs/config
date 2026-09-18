import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

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
				"unicorn/consistent-boolean-name": "off",
				"unicorn/consistent-class-member-order": "off",
				"unicorn/filename-case": [
					"warn",
					{ cases: { camelCase: true, kebabCase: true, pascalCase: true } },
				],
				"unicorn/max-nested-calls": "off",
				"unicorn/name-replacements": "off",
				"unicorn/new-for-builtins": "off",
				"unicorn/no-array-for-each": "off",
				"unicorn/no-array-reduce": "off",
				"unicorn/no-global-object-property-assignment": "off",
				"unicorn/no-immediate-mutation": "off",
				"unicorn/no-negated-condition": "off",
				"unicorn/no-null": "off",
				"unicorn/no-return-array-push": "off",
				"unicorn/no-top-level-assignment-in-function": "off",
				"unicorn/no-unnecessary-global-this":
					type === "lib" || type === "lib-strict" ? "off" : "error",
				"unicorn/no-unreadable-object-destructuring": "off",
				"unicorn/no-useless-undefined": ["error", { checkArguments: true }],
				"unicorn/numeric-separators-style": "off",
				"unicorn/prefer-array-from-range": "off",
				"unicorn/prefer-await": "off",
				"unicorn/prefer-continue": "off", // Might reconsider
				"unicorn/prefer-early-return": "off", // Might reconsider
				"unicorn/prefer-global-this": type === "lib" || type === "lib-strict" ? "warn" : "off",
				"unicorn/prefer-includes-over-repeated-comparisons": "off",
				"unicorn/prefer-native-coercion-functions": "off",
				"unicorn/prefer-simple-condition-first": "off",
				"unicorn/prefer-ternary": "off",
				"unicorn/prevent-abbreviations": "off",
				"unicorn/require-array-sort-compare": "off",
				"unicorn/single-line-block-comment-style": "off",

				...overrides,
			},
		},
	];
};
