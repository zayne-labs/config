import type { AnyString } from "@zayne-labs/toolkit-type-helpers";
import type { Config, Plugin } from "prettier";

type RestOfAllowedPluginTypes = AnyString | Plugin | URL;

type OptionsClassNames = {
	/**
	 * List of additional attributes that enclose class names.
	 * The `class` and `className` attributes are always supported.
	 * @docs [prettier-plugin-classnames#custom-attributes](https://github.com/ony3000/prettier-plugin-classnames#custom-attributes)
	 */
	customAttributes?: string[];
	/**
	 * List of additional functions that enclose class names.
	 * The `classNames` function is always supported.
	 * @docs [prettier-plugin-classnames#custom-functions](https://github.com/ony3000/prettier-plugin-classnames#custom-functions)
	 */
	customFunctions?: string[];
	/**
	 * Criterion for ending the class name on each line when replacing with multi-line.
	 * @default "absolute"
	 * @docs [prettier-plugin-classnames#ending-position](https://github.com/ony3000/prettier-plugin-classnames#ending-position)
	 */
	endPosition?: "absolute" | "relative";

	/**
	 * Transforms non-expression class names into expression syntax if line wrapping occurs.
	 * Note: This transformation does not support reversible formatting.
	 * @default false
	 * @docs [prettier-plugin-classnames#syntax-transformation](https://github.com/ony3000/prettier-plugin-classnames#syntax-transformation)
	 */
	syntaxTransformation?: boolean;
};

export type OptionsTailwindCss = OptionsClassNames & {
	plugins?: Array<
		| "prettier-plugin-tailwindcss"
		// eslint-disable-next-line perfectionist/sort-union-types -- prettier-plugin-tailwindcss should come before prettier-plugin-classnames
		| "prettier-plugin-classnames"
		| "prettier-plugin-merge"
		| RestOfAllowedPluginTypes
	>;

	/**
	 * List of attributes to sort classes in. Supports regex patterns.
	 * @docs [prettier-plugin-tailwindcss#sorting-non-standard-attributes](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-non-standard-attributes)
	 */
	tailwindAttributes?: string[];
	/**
	 * Path to the Tailwind configuration file (v3).
	 * @docs [prettier-plugin-tailwindcss#specifying-your-tailwind-javascript-config-path-tailwind-css-v3](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#specifying-your-tailwind-javascript-config-path-tailwind-css-v3)
	 */
	tailwindConfig?: `./${string}`;
	/**
	 * List of functions or tagged templates to sort classes in. Supports regex patterns.
	 * @docs [prettier-plugin-tailwindcss#sorting-classes-in-function-calls](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#sorting-classes-in-function-calls)
	 */
	tailwindFunctions?: string[];
	/**
	 * Prevent automatic removal of duplicate classes.
	 * @docs [prettier-plugin-tailwindcss#preserving-duplicate-classes](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#preserving-duplicate-classes)
	 */
	tailwindPreserveDuplicates?: boolean;
	/**
	 * Prevent automatic removal of unnecessary whitespace.
	 * @docs [prettier-plugin-tailwindcss#preserving-whitespace](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#preserving-whitespace)
	 */
	tailwindPreserveWhitespace?: boolean;

	/**
	 * Path to the CSS entry point (Tailwind CSS v4+).
	 * @default "./tailwind.css"
	 * @docs [prettier-plugin-tailwindcss#specifying-your-tailwind-stylesheet-path-tailwind-css-v4](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#specifying-your-tailwind-stylesheet-path-tailwind-css-v4)
	 */
	tailwindStylesheet?: `./${string}`;
};

export type OptionsAstro = {
	/**
	 * Enable automatic formatting of attributes to shorthand form (e.g., `<element {name} />`).
	 * @default false
	 * @docs [prettier-plugin-astro#astroallowshorthand](https://github.com/withastro/prettier-plugin-astro#astroallowshorthand)
	 */
	astroAllowShorthand?: boolean;
	/**
	 * Skip formatting of JavaScript frontmatter.
	 * @default false
	 * @docs [prettier-plugin-astro#astroskipfrontmatter](https://github.com/withastro/prettier-plugin-astro#astroskipfrontmatter)
	 */
	astroSkipFrontmatter?: boolean;

	overrides?: Array<
		/**
		 * @docs [prettier-plugin-astro#recommended-configuration](https://github.com/withastro/prettier-plugin-astro#recommended-configuration)
		 */
		| {
				files: "*.astro";
				options: { parser: "astro" };
		  }
		// eslint-disable-next-line perfectionist/sort-union-types -- ignore
		| NonNullable<Config["overrides"]>[number]
	>;
	plugins?: Array<"prettier-plugin-astro" | RestOfAllowedPluginTypes>;
};

export type OptionsSortImports = {
	/**
	 * Regex patterns to control import grouping and order.
	 * Supports special words: `<BUILTIN_MODULES>`, `<THIRD_PARTY_MODULES>`, `<TYPES>`.
	 * Use empty strings (`""`) to add blank lines between groups.
	 * @default ["<BUILTIN_MODULES>", "<THIRD_PARTY_MODULES>", "^[.]"]
	 * @docs [prettier-plugin-sort-imports#importorder](https://github.com/ianvs/prettier-plugin-sort-imports#importorder)
	 */
	importOrder?: string[];
	/**
	 * Enable case-sensitive sorting within import groups.
	 * @default false
	 * @docs [prettier-plugin-sort-imports#importordercasesensitive](https://github.com/ianvs/prettier-plugin-sort-imports#importordercasesensitive)
	 */
	importOrderCaseSensitive?: boolean;
	/**
	 * Babel parser plugins to understand file syntax (e.g., `["typescript", "jsx"]`).
	 * Pass plugin options as JSON: `["decorators", { "decoratorsBeforeExport": true }]`.
	 * @default ["typescript", "jsx"]
	 * @docs [prettier-plugin-sort-imports#importorderparserplugins](https://github.com/ianvs/prettier-plugin-sort-imports#importorderparserplugins)
	 */
	importOrderParserPlugins?: string[];
	/**
	 * Regex patterns for side-effect imports that are safe to reorder.
	 * By default, side-effect imports are not reordered. Use `^pattern$` for exact matches.
	 * @default []
	 * @docs [prettier-plugin-sort-imports#importordersafesideeffects](https://github.com/ianvs/prettier-plugin-sort-imports#importordersafesideeffects)
	 */
	importOrderSafeSideEffects?: string[];
	/**
	 * TypeScript version to enable modern import syntax features (e.g., mixed type/value imports).
	 * @default "1.0.0"
	 * @docs [prettier-plugin-sort-imports#importordertypescriptversion](https://github.com/ianvs/prettier-plugin-sort-imports#importordertypescriptversion)
	 */
	importOrderTypeScriptVersion?: string;

	plugins?: Array<"@ianvs/prettier-plugin-sort-imports" | RestOfAllowedPluginTypes>;
};

// eslint-disable-next-line ts-eslint/consistent-type-definitions -- Allow
export interface OptionsPrettierConfig {
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
	 * Sort imports configuration
	 * @default false
	 * @docs [prettier-plugin-sort-imports](https://github.com/ianvs/prettier-plugin-sort-imports#configuration)
	 */
	sortImports?: boolean | OptionsSortImports;

	/**
	 * Tailwind CSS configuration
	 * @default false
	 * @docs
	 *  - [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
	 *  - [prettier-plugin-classnames](https://github.com/ony3000/prettier-plugin-classnames)
	 *  - [prettier-plugin-merge](https://github.com/ony3000/prettier-plugin-merge)
	 */
	tailwindcss?: boolean | OptionsTailwindCss;
}

export type ResolvedPrettierConfig = Config
	& OptionsAstro
	& OptionsSortImports
	& OptionsTailwindCss
	& Record<string, unknown>;

export type ExtractOptions<TUnion> = Extract<TUnion, object>;
