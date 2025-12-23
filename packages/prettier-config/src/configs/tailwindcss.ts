import type { ExtractOptions, OptionsPrettierConfig } from "@/types";

export const tailwindcss = (
	options: ExtractOptions<OptionsPrettierConfig["tailwindcss"]>
): typeof options => {
	return {
		tailwindStylesheet: "./tailwind.css",

		...options,

		customAttributes: ["classNames", "classes", ...(options.customAttributes ?? [])],
		customFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw", ...(options.customFunctions ?? [])],
		plugins: [
			"prettier-plugin-tailwindcss",
			"prettier-plugin-classnames",

			...(options.plugins ?? []),

			/**
			 * This plugin must always come last
			 * @see https://github.com/ony3000/prettier-plugin-merge#why-prettier-plugin-merge
			 */
			"prettier-plugin-merge",
		],
		tailwindAttributes: ["classNames", "classes", ...(options.tailwindAttributes ?? [])],
		tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw", ...(options.tailwindFunctions ?? [])],
	};
};
