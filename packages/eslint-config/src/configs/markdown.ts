import { mergeProcessors, processorPassThrough } from "eslint-merge-processors";
import {
	GLOB_MARKDOWN,
	GLOB_MARKDOWN_CODE,
	GLOB_MARKDOWN_IN_MARKDOWN,
	GLOB_MARKDOWN_JSON,
} from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault, parserPlain } from "../utils";

export const markdown = async (
	options: ExtractOptions<OptionsConfig["markdown"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { componentExts = [], files = [GLOB_MARKDOWN], overrides } = options;

	const eslintPluginMarkdown = await interopDefault(import("@eslint/markdown"));

	const recommendedRules = eslintPluginMarkdown.configs.recommended
		.map((config) => config.rules)
		.reduce<TypedFlatConfigItem["rules"]>((accumulator, rules) => ({ ...accumulator, ...rules }), {});

	return [
		{
			name: "zayne/markdown/setup",

			plugins: {
				markdown: eslintPluginMarkdown,
			},
		},

		{
			files,

			languageOptions: {
				parser: parserPlain,
			},

			name: "zayne/markdown/parser",
		},

		{
			files,
			ignores: [GLOB_MARKDOWN_IN_MARKDOWN],
			name: "zayne/markdown/processor",
			// `@eslint/markdown` only creates virtual files for code blocks, but not the markdown file itself.
			// We use `eslint-merge-processors` to add a pass-through processor for the markdown file itself.
			processor: mergeProcessors([eslintPluginMarkdown.processors.markdown, processorPassThrough]),
		},

		{
			files,

			name: "zayne/markdown/recommended",
			rules: recommendedRules,
		},

		{
			files,

			name: "zayne/markdown/rules",

			rules: {
				...overrides,
			},
		},

		{
			files: [
				...files,
				GLOB_MARKDOWN_CODE,
				GLOB_MARKDOWN_JSON,
				...componentExts.map((ext) => `${GLOB_MARKDOWN}/**/*.${ext}`),
			],

			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						impliedStrict: true,
					},
				},
			},

			name: "zayne/markdown/disables",

			rules: {
				"import/no-extraneous-dependencies": "off",

				"jsonc/no-dupe-keys": "off",

				"no-alert": "off",
				"no-console": "off",
				"no-labels": "off",
				"no-lone-blocks": "off",
				"no-restricted-syntax": "off",
				"no-undef": "off",
				"no-unused-expressions": "off",
				"no-unused-labels": "off",

				"no-unused-vars": "off",

				"node/prefer-global/process": "off",

				"perfectionist/sort-objects": "off",

				"ts-eslint/consistent-type-imports": "off",
				"ts-eslint/explicit-function-return-type": "off",
				"ts-eslint/no-namespace": "off",
				"ts-eslint/no-redeclare": "off",
				"ts-eslint/no-require-imports-eslint": "off",
				"ts-eslint/no-unused-expressions": "off",
				"ts-eslint/no-unused-vars": "off",

				"ts-eslint/no-use-before-define": "off",

				"unicode-bom": "off",

				"unicorn/filename-case": "off",
				"unicorn/prefer-export-from": "off",
			},
		},
	];
};
