import { type AnyString, defineEnum, defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { Config } from "prettier";

export const baseConfig = defineEnum({
	experimentalOperatorPosition: "start",
	jsxSingleQuote: false,
	printWidth: 107,
	singleQuote: false,
	tabWidth: 3,
	trailingComma: "es5",
	useTabs: true,
}) satisfies Config;

export type ConfigWithTailwind = Omit<Config, "plugins"> & {
	customAttributes?: string[];
	customFunctions?: string[];
	endPosition?: "absolute-with-indent" | "absolute" | "relative";
	plugins?: Array<
		// eslint-disable-next-line perfectionist/sort-union-types -- prettier-plugin-tailwindcss should come before prettier-plugin-classnames
		"prettier-plugin-tailwindcss" | "prettier-plugin-classnames" | "prettier-plugin-merge" | AnyString
	>;
	tailwindAttributes?: string[];
	tailwindConfig?: `./${string}`;
	tailwindFunctions?: string[];
	tailwindPreserveDuplicates?: boolean;
	tailwindPreserveWhitespace?: boolean;
	tailwindStylesheet?: `./${string}`;
};

/**
 * @description Prettier configuration with Tailwind CSS support.
 *
 * @docs
 *  - [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
 *  - [prettier-plugin-classnames](https://github.com/ony3000/prettier-plugin-classnames)
 *  - [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge)
 */
export const configWithTailwind = defineEnumDeep({
	...baseConfig,
	customAttributes: ["classNames", "classes"],
	customFunctions: ["cnMerge", "cnJoin", "cn", "tv"],
	endingPosition: "absolute-with-indent",
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
	tailwindAttributes: ["classNames", "classes"],
	tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv"],
	tailwindStylesheet: "./tailwind.css",
}) satisfies ConfigWithTailwind;
