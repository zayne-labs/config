import { GLOB_ASTRO } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export const astro = async (
	options: ExtractOptions<OptionsConfig["astro"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_ASTRO], overrides, typescript = true } = options;

	await ensurePackages(["eslint-plugin-astro", "astro-eslint-parser"]);

	const [eslintPluginAstro, parserAstro, tsEslint] = await Promise.all([
		interopDefault(import("eslint-plugin-astro")),
		interopDefault(import("astro-eslint-parser")),
		typescript ? interopDefault(import("typescript-eslint")) : undefined,
	]);

	const recommendedRules = eslintPluginAstro.configs.recommended
		.map((config) => config.rules)
		.reduce<TypedFlatConfigItem["rules"]>((accumulator, rules) => ({ ...accumulator, ...rules }), {});

	return [
		{
			name: "zayne/astro/setup",

			plugins: {
				astro: eslintPluginAstro,
			},
		},

		{
			files,

			languageOptions: {
				globals: eslintPluginAstro.environments.astro.globals,
				parser: parserAstro,
				parserOptions: {
					extraFileExtensions: [".astro"],
					...(typescript && { parser: tsEslint?.parser }),
				},
				sourceType: "module",
			},

			name: "zayne/astro/parser",

			processor: typescript ? "astro/client-side-ts" : "astro/astro",
		},

		{
			files,

			name: "zayne/astro/recommended",

			rules: recommendedRules,
		},

		{
			files,

			name: "zayne/astro/rules",

			rules: {
				...overrides,
			},
		},
	];
};
