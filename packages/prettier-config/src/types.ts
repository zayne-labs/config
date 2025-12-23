import type { AnyString } from "@zayne-labs/toolkit-type-helpers";
import type { Config, Plugin } from "prettier";

export type OptionsTailwindCss = {
	/**
	 * @docs [prettier-plugin-classnames#custom-attributes](https://github.com/ony3000/prettier-plugin-classnames#custom-attributes)
	 */
	customAttributes?: string[];
	/**
	 * @docs [prettier-plugin-classnames#custom-functions](https://github.com/ony3000/prettier-plugin-classnames#custom-functions)
	 */
	customFunctions?: string[];
	/**
	 * @docs [prettier-plugin-classnames#ending-position](https://github.com/ony3000/prettier-plugin-classnames#ending-position)
	 */
	endPosition?: "absolute" | "relative";
	plugins?: Array<
		| "prettier-plugin-tailwindcss"
		// eslint-disable-next-line perfectionist/sort-union-types -- prettier-plugin-tailwindcss should come before prettier-plugin-classnames
		| "prettier-plugin-classnames"
		| "prettier-plugin-merge"
		| AnyString
		| Plugin
		| URL
	>;
	tailwindAttributes?: string[];
	tailwindConfig?: `./${string}`;
	tailwindFunctions?: string[];
	tailwindPreserveDuplicates?: boolean;
	tailwindPreserveWhitespace?: boolean;
	tailwindStylesheet?: `./${string}`;
};

export type OptionsAstro = {
	astroAllowShorthand?: boolean;
	astroSkipFrontmatter?: boolean;
	overrides?: Array<
		| {
				files: "*.astro";
				options: { parser: "astro" };
		  }
		// eslint-disable-next-line perfectionist/sort-union-types -- ignore
		| NonNullable<Config["overrides"]>[number]
	>;
	plugins?: Array<"prettier-plugin-astro" | AnyString | Plugin | URL>;
};

export type OptionsConfig = {
	/**
	 * Astro configuration
	 * @default false
	 * @docs [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro#configuration)
	 */
	astro?: boolean | OptionsAstro;

	/**
	 * Base Prettier configuration with opinionated defaults.
	 * Includes settings for tabs, print width, quotes, trailing commas, and experimental features.
	 * @default true
	 */
	base?: boolean | Config;

	/**
	 * Tailwind CSS configuration
	 * @default false
	 * @docs
	 *  - [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
	 *  - [prettier-plugin-classnames](https://github.com/ony3000/prettier-plugin-classnames)
	 *  - [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge)
	 */
	tailwindcss?: boolean | OptionsTailwindCss;
};

export type ResolvedPrettierConfig = Config & OptionsAstro & OptionsTailwindCss;

export type ExtractOptions<TUnion> = Extract<TUnion, object>;
