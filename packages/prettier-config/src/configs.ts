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
	customFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw"],
	endingPosition: "absolute-with-indent",
	plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
	tailwindAttributes: ["classNames", "classes"],
	tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw"],
	tailwindStylesheet: "./tailwind.css",
}) satisfies ConfigWithTailwind;

export type ConfigWithAstro = Omit<Config, "plugins"> & {
	astroAllowShorthand?: boolean;
	astroSkipFrontmatter?: boolean;
	plugins?: Array<"prettier-plugin-astro" | AnyString>;
};

/**
 * @description Prettier configuration with Astro support.
 *
 * @docs [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro#configuration)
 */

export const configWithAstro = defineEnumDeep({
	...baseConfig,

	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
	plugins: ["prettier-plugin-astro"],
}) satisfies ConfigWithAstro;
