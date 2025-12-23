import type { ExtractOptions, OptionsConfig } from "@/types";

export const tailwindcss = (options: ExtractOptions<OptionsConfig["tailwindcss"]>): typeof options => {
	return {
		...options,
		customAttributes: ["classNames", "classes", ...(options.customAttributes ?? [])],
		customFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw", ...(options.customFunctions ?? [])],
		plugins: [
			"prettier-plugin-tailwindcss",
			"prettier-plugin-classnames",
			"prettier-plugin-merge",
			...(options.plugins ?? []),
		],
		tailwindAttributes: ["classNames", "classes", ...(options.tailwindAttributes ?? [])],
		tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw", ...(options.tailwindFunctions ?? [])],
		tailwindStylesheet: options.tailwindStylesheet ?? "./tailwind.css",
	};
};
