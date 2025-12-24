import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages } from "@/utils";

export const astro = async (
	options: ExtractOptions<OptionsPrettierConfig["astro"]>
): Promise<typeof options> => {
	const necessaryPlugins = ["prettier-plugin-astro"];

	await ensurePackages(necessaryPlugins);

	return {
		...options,

		overrides: [
			{
				files: "*.astro",
				options: { parser: "astro" },
			},
			...(options.overrides ?? []),
		],

		plugins: [...necessaryPlugins, ...(options.plugins ?? [])],
	};
};
