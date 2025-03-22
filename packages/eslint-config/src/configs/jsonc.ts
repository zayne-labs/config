import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from "@/globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

const jsonc = async (
	options: ExtractOptions<OptionsConfig["jsonc"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC], overrides, stylistic = true } = options;

	const [eslintPluginJsonc, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-jsonc")),
		interopDefault(import("jsonc-eslint-parser")),
	] as const);

	return [
		{
			name: "zayne/jsonc/setup",

			plugins: {
				jsonc: eslintPluginJsonc,
			},
		},

		{
			files,

			languageOptions: {
				parser: jsoncParser,
			},

			name: "zayne/jsonc/rules",

			rules: {
				"jsonc/no-bigint-literals": "error",
				"jsonc/no-binary-expression": "error",
				"jsonc/no-binary-numeric-literals": "error",
				"jsonc/no-dupe-keys": "error",
				"jsonc/no-escape-sequence-in-identifier": "error",
				"jsonc/no-floating-decimal": "error",
				"jsonc/no-hexadecimal-numeric-literals": "error",
				"jsonc/no-infinity": "error",
				"jsonc/no-multi-str": "error",
				"jsonc/no-nan": "error",
				"jsonc/no-number-props": "error",
				"jsonc/no-numeric-separators": "error",
				"jsonc/no-octal": "error",
				"jsonc/no-octal-escape": "error",
				"jsonc/no-octal-numeric-literals": "error",
				"jsonc/no-parenthesized": "error",
				"jsonc/no-plus-sign": "error",
				"jsonc/no-regexp-literals": "error",
				"jsonc/no-sparse-arrays": "error",
				"jsonc/no-template-literals": "error",
				"jsonc/no-undefined-value": "error",
				"jsonc/no-unicode-codepoint-escapes": "error",
				"jsonc/no-useless-escape": "error",
				"jsonc/space-unary-ops": "error",
				"jsonc/valid-json-number": "error",
				"jsonc/vue-custom-block/no-parsing-error": "error",

				...(stylistic && {
					"jsonc/array-bracket-spacing": ["error", "never"],
					"jsonc/comma-dangle": ["error", "never"],
					"jsonc/comma-style": ["error", "last"],
					"jsonc/key-spacing": ["error", { afterColon: true, beforeColon: false }],
					"jsonc/object-curly-newline": ["error", { consistent: true, multiline: true }],
					"jsonc/object-curly-spacing": ["error", "always"],
					"jsonc/object-property-newline": ["error", { allowMultiplePropertiesPerLine: true }],
					"jsonc/quote-props": "error",
					"jsonc/quotes": "error",
				}),

				...overrides,
			},
		},
	];
};

export { jsonc };
