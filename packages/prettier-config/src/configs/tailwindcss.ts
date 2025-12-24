import { getDefaultTailwindSettings } from "@/constants/defaults";
import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages } from "@/utils";

export const tailwindcss = async (
	options: ExtractOptions<OptionsPrettierConfig["tailwindcss"]>
): Promise<typeof options> => {
	const necessaryPlugins = {
		first: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames"],
		last: ["prettier-plugin-merge"],
	} as const;

	await ensurePackages([...necessaryPlugins.first, ...necessaryPlugins.last]);

	const tailwindSettings = getDefaultTailwindSettings();

	return {
		tailwindStylesheet: tailwindSettings.tailwindStylesheet,

		...options,

		customAttributes: [...tailwindSettings.tailwindAttributes, ...(options.customAttributes ?? [])],
		customFunctions: [...tailwindSettings.tailwindFunctions, ...(options.customFunctions ?? [])],

		plugins: [
			...necessaryPlugins.first,

			...(options.plugins ?? []),

			/**
			 * The 'merge' plugin must always come last
			 * @see https://github.com/ony3000/prettier-plugin-merge#why-prettier-plugin-merge
			 */
			...necessaryPlugins.last,
		],

		tailwindAttributes: [...tailwindSettings.tailwindAttributes, ...(options.tailwindAttributes ?? [])],
		tailwindFunctions: [...tailwindSettings.tailwindFunctions, ...(options.tailwindFunctions ?? [])],
	};
};
