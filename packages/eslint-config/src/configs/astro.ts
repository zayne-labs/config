import { GLOB_ASTRO } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export const astro = async (
	options: ExtractOptions<OptionsConfig["astro"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_ASTRO], overrides, typescript = true } = options;

	const [pluginAstro, parserAstro] = await Promise.all([
		interopDefault(import("eslint-plugin-astro")),
		interopDefault(import("astro-eslint-parser")),
	]);

	return [
		{
			name: "zayne/astro/setup",

			plugins: {
				astro: pluginAstro,
			},
		},

		{
			files,

			languageOptions: {
				globals: pluginAstro.environments.astro.globals,
				parser: parserAstro,
				parserOptions: {
					extraFileExtensions: [".astro"],
					// eslint-disable-next-line unicorn/no-await-expression-member -- ignore for now
					...(typescript && { parser: (await interopDefault(import("typescript-eslint"))).parser }),
				},
				sourceType: "module",
			},

			name: "zayne/astro/recommended",

			processor: typescript ? "astro/client-side-ts" : "astro/astro",

			rules: pluginAstro.configs.recommended.at(-1)?.rules,
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
