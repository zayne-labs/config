import type { ExtractOptions, OptionsConfig } from "@/types";

export const astro = (options: ExtractOptions<OptionsConfig["astro"]>): typeof options => {
	return {
		...options,
		overrides: [
			{
				files: "*.astro",
				options: { parser: "astro" },
			},
			...(options.overrides ?? []),
		],
		plugins: ["prettier-plugin-astro", ...(options.plugins ?? [])],
	};
};
