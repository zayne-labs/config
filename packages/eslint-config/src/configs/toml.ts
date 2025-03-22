import { GLOB_TOML } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export const toml = async (
	options: ExtractOptions<OptionsConfig["toml"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_TOML], overrides, stylistic = true } = options;

	const [pluginToml, parserToml] = await Promise.all([
		interopDefault(import("eslint-plugin-toml")),
		interopDefault(import("toml-eslint-parser")),
	]);

	return [
		{
			name: "zayne/toml/setup",

			plugins: {
				toml: pluginToml,
			},
		},

		{
			files,

			languageOptions: {
				parser: parserToml,
			},

			name: "zayne/toml/rules",

			rules: {
				"style/spaced-comment": "off",

				"toml/comma-style": "error",
				"toml/keys-order": "error",
				"toml/no-space-dots": "error",
				"toml/no-unreadable-number-separator": "error",
				"toml/precision-of-fractional-seconds": "error",
				"toml/precision-of-integer": "error",
				"toml/tables-order": "error",

				"toml/vue-custom-block/no-parsing-error": "error",

				...(stylistic && {
					"toml/array-bracket-newline": "error",
					"toml/array-bracket-spacing": "error",
					"toml/array-element-newline": "error",
					// "toml/indent": ["error", indent],
					"toml/inline-table-curly-spacing": "error",
					"toml/key-spacing": "error",
					"toml/padding-line-between-pairs": "error",
					"toml/padding-line-between-tables": "error",
					"toml/quoted-keys": "error",
					"toml/spaced-comment": "error",
					"toml/table-bracket-spacing": "error",
				}),

				...overrides,
			},
		},
	];
};
