import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages } from "@/utils";

export const astro = async (
	options: ExtractOptions<OptionsPrettierConfig["astro"]>
): Promise<typeof options> => {
	await ensurePackages(["prettier-plugin-astro"]);

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
