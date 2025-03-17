import { GLOB_YAML } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export const yaml = async (
	options: ExtractOptions<OptionsConfig["yaml"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_YAML], overrides, stylistic = true } = options;

	const [pluginYaml, parserYaml] = await Promise.all([
		interopDefault(import("eslint-plugin-yml")),
		interopDefault(import("yaml-eslint-parser")),
	]);

	return [
		{
			name: "zayne/yaml/setup",
			plugins: {
				yaml: pluginYaml,
			},
		},
		{
			files,

			languageOptions: {
				parser: parserYaml,
			},

			name: "zayne/yaml/rules",

			rules: {
				"yaml/block-mapping": "error",
				"yaml/block-sequence": "error",
				"yaml/no-empty-key": "error",
				"yaml/no-empty-sequence-entry": "error",
				"yaml/no-irregular-whitespace": "error",
				"yaml/plain-scalar": "error",

				"yaml/vue-custom-block/no-parsing-error": "error",

				...(stylistic && {
					"yaml/block-mapping-question-indicator-newline": "error",
					"yaml/block-sequence-hyphen-indicator-newline": "error",
					"yaml/flow-mapping-curly-newline": "error",
					"yaml/flow-mapping-curly-spacing": "error",
					"yaml/flow-sequence-bracket-newline": "error",
					"yaml/flow-sequence-bracket-spacing": "error",
					// "yaml/indent": ["error", indent],
					"yaml/key-spacing": "error",
					"yaml/no-tab-indent": "error",
					// "yaml/quotes": [
					// 	"error",
					// 	{ avoidEscape: true, prefer: quotes === "backtick" ? "double" : quotes },
					// ],
					"yaml/spaced-comment": "error",
				}),

				"stylistic/spaced-comment": "off",

				...overrides,
			},
		},
	];
};
