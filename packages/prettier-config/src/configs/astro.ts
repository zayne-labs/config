import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

export const astro = async (
	options: ExtractOptions<OptionsPrettierConfig["astro"]>
): Promise<typeof options> => {
	await ensurePackages(["prettier-plugin-astro"]);

	const prettierPluginAstro = await interopDefault(import("prettier-plugin-astro"));

	return {
		...options,

		overrides: [
			{
				files: "*.astro",
				options: { parser: "astro" },
			},
			...(options.overrides ?? []),
		],

		plugins: [prettierPluginAstro, ...(options.plugins ?? [])],
	};
};
