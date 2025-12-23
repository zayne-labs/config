import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from "@/globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

const jsonc = async (
	options: ExtractOptions<OptionsConfig["jsonc"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_JSON, GLOB_JSON5, GLOB_JSONC], overrides } = options;

	const [eslintPluginJsonc, parserJsonc] = await Promise.all([
		interopDefault(import("eslint-plugin-jsonc")),
		interopDefault(import("jsonc-eslint-parser")),
	]);

	const recommendedRules = eslintPluginJsonc.configs["flat/recommended-with-jsonc"]
		.map((config) => config.rules)
		.reduce<TypedFlatConfigItem["rules"]>((accumulator, rules) => ({ ...accumulator, ...rules }), {});

	const disablePrettierRules = eslintPluginJsonc.configs["flat/prettier"].at(-1)?.rules;

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
				parser: parserJsonc,
			},

			name: "zayne/jsonc/parser",
		},

		{
			files,

			name: "zayne/jsonc/recommended",

			rules: recommendedRules,
		},

		{
			files,

			name: "zayne/jsonc/rules",

			rules: {
				...overrides,
			},
		},

		{
			files,

			name: "zayne/jsonc/disables-prettier",

			rules: disablePrettierRules,
		},
	];
};

export { jsonc };
