import type { ExtractOptions, OptionsPrettierConfig } from "@/types";

export const astro = (options: ExtractOptions<OptionsPrettierConfig["astro"]>): typeof options => {
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
