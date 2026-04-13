/* eslint-disable ts-eslint/consistent-type-definitions -- Users need to be able to override styles, so interfaces are needed */
import type { Linter } from "eslint";
import type { ConfigWithExtends } from "eslint-flat-config-utils";
import type { RuleOptions } from "../typegen";

export type { ConfigNames, RuleOptions } from "../typegen";

type Rules = Record<string, Linter.RuleEntry | undefined> & RuleOptions;

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins`, because
 * many plugins still lack proper type definitions.
 */
export type TypedFlatConfigItem = Omit<ConfigWithExtends, "plugins" | "rules"> & {
	// eslint-disable-next-line ts-eslint/no-explicit-any -- Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	plugins?: Record<string, any>;
	rules?: Rules;
};

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
}

export interface OptionsOverridesMultiple<TArray extends string[]> {
	overrides?: Record<TArray[number], OptionsOverrides["overrides"]>;
}

export interface OptionsAppType {
	/**
	 * Specify application type
	 * @default "app"
	 */

	// eslint-disable-next-line perfectionist/sort-union-types -- App type should be first
	type?: "app" | "app-strict" | "lib" | "lib-strict";
}

export interface OptionsFiles {
	/**
	 * Override the `files` option to provide custom globs.
	 */
	files?: string[];
}

export interface OptionsVue {
	/**
	 * Vue accessibility plugin. Help check a11y issue in `.vue` files upon enabled
	 *
	 * @see https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/
	 * @default false
	 */
	a11y?: boolean;

	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default true
	 */
	sfcBlocks?: import("eslint-processor-vue-blocks").Options | boolean;

	/**
	 * Vue version. Apply different rules set from `eslint-plugin-vue`.
	 * @default 3
	 */
	vueVersion?: 2 | 3;
}

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[];
}

export interface OptionsComponentExtsTypeAware {
	/**
	 * Additional extensions for components that should be type aware.
	 * @example ['vue']
	 * @default []
	 */
	componentExtsTypeAware?: string[];
}

export interface OptionsTypeScriptParserOptions {
	/**
	 *	Default projects to allow in the parser project service.
	 * Ensure you don't use more than 8 defaultProjects.
	 * @see https://typescript-eslint.io/packages/parser#projectserviceoptions
	 */
	allowDefaultProject?: [string?, string?, string?, string?, string?, string?, string?, string?];

	/**
	 * Additional parser options for TypeScript.
	 * @see https://typescript-eslint.io/packages/parser
	 */
	parserOptions?: Partial<import("@typescript-eslint/parser").ParserOptions>;
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[];

	/**
	 * Glob patterns for files that should not be type aware.
	 * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
	 */
	ignoresTypeAware?: string[];

	/**
	 * Whether type aware rules are enabled or not.
	 * @default depends on the `tsconfigPath` option or if the `typescript` option is set to true
	 */
	isTypeAware?: boolean;

	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/packages/parser#project
	 */
	tsconfigPath?: true | string | string[] | null;
}

export interface OptionsTypeScriptErasableOnly {
	/**
	 * Enable erasable syntax only rules.
	 *
	 * @see https://github.com/JoshuaKGoldberg/eslint-plugin-erasable-syntax-only
	 * @default false
	 */
	erasableOnly?: boolean;
}

export type OptionsTypescript = (OptionsComponentExts
	& OptionsComponentExtsTypeAware
	& OptionsTypeScriptErasableOnly)
	& (OptionsTypeScriptParserOptions | OptionsTypeScriptWithTypes);

export interface OptionsHasTypeScript {
	/**
	 *  Enable typescript rules
	 *
	 * Requires typescript config to be enabled, or the typescript parser to be provided to the plugin
	 * @default true
	 */
	typescript?: boolean;
}

export interface OptionsReact {
	/**
	 * Enable react compiler rules.
	 * @default true
	 */
	compiler?: boolean | OptionsOverrides;

	/**
	 * Enable nextjs rules.
	 *
	 * Requires installing:
	 * - `@next/eslint-plugin-next`
	 * @default auto-detect-from-dependencies
	 */
	nextjs?: (OptionsFiles & OptionsOverrides) | boolean;

	/**
	 * Enable default react rules.
	 * @default true
	 */
	react?: boolean | OptionsOverrides;

	/**
	 * Enable react-refresh(HMR) rules.
	 * @default true
	 */
	refresh?: (OptionsFiles & OptionsOverrides) | boolean;

	/**
	 * Enable react-you-might-not-need-an-effect rules.
	 * @default true
	 */
	youMightNotNeedAnEffect?: boolean | OptionsOverrides;
}

export interface OptionsJSX {
	/**
	 * Enable JSX accessibility rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-jsx-a11y`
	 *
	 * @default false
	 */
	a11y?: boolean | OptionsOverrides;
}

export interface OptionsStylistic {
	indent?: number;

	quotes?: "backtick" | "double" | "single";

	/**
	 *  Enable stylistic rules
	 * @default true
	 */
	stylistic?: boolean;
}

export interface OptionsTanstack {
	/**
	 *  Enable tanstack query linting
	 *
	 *  Requires installing:
	 * - `@tanstack/eslint-plugin-query`
	 * @default false
	 */
	query?: boolean | OptionsOverrides;

	/**
	 *  Enable tanstack router linting
	 *
	 * Requires installing:
	 * - `@tanstack/eslint-plugin-router`
	 * @default false
	 */
	router?: boolean | OptionsOverrides;
}

export interface OptionsHasJsx {
	jsx?: boolean;
}

export interface OptionsTailwindCSS {
	settings?: {
		callees: string[];
		classRegex: string;
		config: string;
		cssFiles: string[];
		cssFilesRefreshRate: number;
		removeDuplicates: boolean;
		skipClassAttribute: boolean;
		tags: string[];
		whitelist: string[];
	};
}

type SelectorMatcherArray = Array<{
	match?: SelectorMatcherArray;
	path?: string;
	type: "anonymousFunctionReturn" | "objectKeys" | "objectValues" | "strings";
}>;

type AttributeSelector = {
	kind: "attribute";
	match?: SelectorMatcherArray;
	name: string;
};

type CalleeSelector = {
	kind: "callee";
	match?: SelectorMatcherArray;
	targetArgument?: "all" | "first" | "last" | number;
	targetCall?: "all" | "first" | "last" | number;
} & ({ name: string; path?: string } | { name?: string; path: string });

type VariableSelector = {
	kind: "variable";
	match?: SelectorMatcherArray;
	name: string;
};

type TagSelector = {
	kind: "tag";
	match?: SelectorMatcherArray;
} & ({ name: string; path?: string } | { name?: string; path: string });

type TailwindCSSBetterSelector = AttributeSelector | CalleeSelector | TagSelector | VariableSelector;

export interface OptionsTailwindCSSBetter {
	settings?: {
		/**
		 * The working directory used to resolve tailwindcss and related config files. This is useful for monorepos where linting runs from the repository root but each project has its own node_modules and Tailwind setup.
		 *
		 * This path is resolved relative to the current working directory of the ESLint process. If not specified, it falls back to the current working directory of the ESLint process.
		 *
		 * You can configure settings["better-tailwindcss"].cwd per file group so the plugin resolves tailwindcss and config files from the correct project directory.
		 *
		 * @example
		 * ```ts
		 * // eslint.config.ts
		 * export default [
		 *   {
		 *     files: ["packages/website/**\/*.{js,jsx,cjs,mjs,ts,tsx}"],
		 *     settings: {
		 *       "better-tailwindcss": {
		 *         cwd: "./packages/website"
		 *       }
		 *     }
		 *   },
		 *   {
		 *     files: ["packages/app/**\/*.{js,jsx,cjs,mjs,ts,tsx}"],
		 *     settings: {
		 *       "better-tailwindcss": {
		 *         cwd: "./packages/app"
		 *       }
		 *     }
		 *   }
		 * ];
		 * ```
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#cwd
		 */
		cwd?: string;

		/**
		 * Tailwind CSS v4 allows you to define custom component classes like `card`, `btn`, `badge` etc.
		 *
		 * If you want to create such classes, you can set this option to `true` to allow the rule to detect those classes and not report them as unknown classes.
		 *
		 * @default false
		 */
		detectComponentClasses?: boolean;

		/**
		 * The path to the entry file of the css based tailwind config (eg: src/global.css).
		 * If not specified, the plugin will fall back to the default configuration.
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#entrypoint
		 */
		entryPoint?: string;

		/**
		 * An array of selectors that tell the plugin **where to look for Tailwind class strings**
		 * and how to extract them from your source code.
		 *
		 * Because linting every string literal in your codebase would produce many false positives,
		 * the plugin only lints strings in locations you explicitly (or via the built-in defaults) declare.
		 *
		 * **You only need this option when:**
		 * - You use custom utilities/APIs not covered by the defaults (e.g. a custom `cx()` wrapper).
		 * - You want to narrow or broaden the default linting locations.
		 *
		 * To **extend** the defaults rather than replace them, spread `getDefaultSelectors()`:
		 * ```ts
		 * import { getDefaultSelectors } from "eslint-plugin-better-tailwindcss/defaults";
		 * import { SelectorKind } from "eslint-plugin-better-tailwindcss/types";
		 *
		 * selectors: [
		 *   ...getDefaultSelectors(), // preserve default selectors
		 *   {
		 *     kind: SelectorKind.Attribute,
		 *     match: [{ type: "objectValues" }],
		 *     name: "^classNames$"
		 *   }
		 * ]
		 * ```
		 *
		 * ### Selector kinds
		 * Every selector targets one kind of source location and tells the plugin how to extract class strings from it.
		 *
		 * | Kind        | Targets                                              |
		 * | ----------- | ---------------------------------------------------- |
		 * | `attribute` | JSX / HTML attribute values (e.g. `class`, `className`) |
		 * | `callee`    | Function / method call arguments (e.g. `cn(...)`, `cva(...)`) |
		 * | `variable`  | Variable declaration values (e.g. `const cls = "..."`) |
		 * | `tag`       | Tagged template literals (e.g. `` tw`...` ``)       |
		 *
		 * ### Matchers
		 * Every selector can then match different types of string literals based on the provided `match` option.
		 * When omitted, only direct string literals are collected.
		 *
		 * - `"strings"` – Matches all string literals that are not object keys or object values.
		 * - `"objectKeys"` – Matches all object keys.
		 * - `"objectValues"` – Matches all object values.
		 * - `"anonymousFunctionReturn"` – Matches values returned from anonymous functions and applies nested matchers to those return values.
		 *
		 * ### Path Option Details
		 * The `path` option lets you narrow down `objectKeys` and `objectValues` matching to specific object paths.
		 * This is especially useful for libraries like Class Variance Authority (cva), where class names appear in nested object structures.
		 *
		 * The `path` string reflects how the string is nested in the object:
		 * - Dot notation for plain keys: `root.nested.values`
		 * - Square brackets for arrays: `values[0]`
		 * - Quoted brackets for special characters: `root["some-key"]`
		 *
		 * @example
		 * // Lint cva() strings + specific nested values
		 * selectors: [
		 *   {
		 *     kind: "callee",
		 *     name: "^cva$",
		 *     match: [
		 *       {
		 *         type: "strings"
		 *       },
		 *       {
		 *         type: "objectValues",
		 *         path: "^compoundVariants\\[\\d+\\]\\.(?:className|class)$"
		 *       }
		 *     ],
		 *   },
		 * ]
		 *
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/configuration/advanced.md#selectors
		 */
		selectors?: TailwindCSSBetterSelector[];

		/**
		 * The path to the tailwind.config.js file.
		 * For tailwindcss v4 and the css based config, use the `entryPoint` option instead.
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#tailwindconfig
		 */
		tailwindConfig?: string;

		/**
		 * The path to the tsconfig.json file. Used to resolve tsconfig path aliases.
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#tsconfig
		 */
		tsconfig?: string;
	};
}

export interface OptionsRegExp {
	/**
	 * Override rule levels
	 */
	level?: "error" | "warn";
}

export interface OptionsNode {
	/**
	 *  Enable eslint-plugin-security
	 * @default false
	 */
	security?: boolean | OptionsOverrides;
}

export interface OptionsIsInEditor {
	isInEditor?: boolean;
}

export interface OptionsPnpm {
	/**
	 * Requires catalogs usage
	 * @default false
	 * @see https://pnpm.io/workspaces#catalogs
	 */
	catalogs?: boolean;

	/**
	 * Enable linting for package.json, will install the jsonc parser
	 *
	 * @default true
	 */
	json?: boolean | OptionsOverrides;

	/**
	 * Sort entries in pnpm-workspace.yaml
	 *
	 * @default false
	 */
	sort?: boolean;

	/**
	 * Enable linting for pnpm-workspace.yaml, will install the yaml parser
	 *
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides;
}

export interface OptionsE18e {
	/**
	 * Include modernization rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#modernization
	 * @default true
	 */
	modernization?: boolean;
	/**
	 * Include module replacements rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#module-replacements
	 * @default type === 'lib' && isInEditor
	 */
	moduleReplacements?: boolean;
	/**
	 * Include performance improvements rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#performance-improvements
	 * @default true
	 */
	performanceImprovements?: boolean;
}

export interface OptionsMarkdown {
	/**
	 * Enable GFM (GitHub Flavored Markdown) support.
	 *
	 * @default true
	 */
	gfm?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts, OptionsComponentExtsTypeAware {
	/**
	 * Enable ASTRO support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 * - `astro-eslint-parser`
	 *
	 * @default false
	 */
	astro?: (OptionsFiles & OptionsHasTypeScript & OptionsOverrides) | boolean;

	/**
	 * Automatically rename plugins in the config.
	 * @default true
	 */
	autoRenamePlugins?: boolean;

	/**
	 * Enable linting rules for eslint comments.
	 * @default true
	 */
	comments?: (OptionsAppType & OptionsOverrides) | boolean;

	/**
	 * Enable dependency rules via `eslint-plugin-depend`.
	 *
	 * @see https://github.com/es-tooling/eslint-plugin-depend
	 *
	 * Requires installing:
	 * - `eslint-plugin-depend`
	 *
	 * @default false
	 */
	depend?: (OptionsFiles & OptionsOverrides) | boolean;

	/**
	 *  Enable expo support.
	 *
	 * Require installing:
	 * - `eslint-plugin-expo`
	 *
	 * @default false
	 */
	expo?: boolean | OptionsOverrides;

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 * @default true
	 */
	gitignore?: import("eslint-config-flat-gitignore").FlatGitignoreOptions | boolean;

	/**
	 * Extend the global ignores.
	 *
	 * Passing an array to extends the ignores.
	 * Passing a function to modify the default ignores.
	 *
	 * @default []
	 */
	ignores?: string[] | ((originals: string[]) => string[]);

	/**
	 * Enable linting rules for imports.
	 * @default true
	 */
	imports?: (OptionsHasTypeScript & OptionsOverrides & OptionsStylistic) | boolean;

	/**
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean;

	/**
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsIsInEditor & OptionsOverrides;

	/**
	 * Enable jsdoc linting.
	 * @default true
	 */
	jsdoc?: (OptionsFiles & OptionsOverrides & OptionsStylistic) | boolean;

	/**
	 * Enable JSONC support.
	 * @default true
	 */
	jsonc?: (OptionsFiles & OptionsOverrides) | boolean;

	/**
	 * Enable JSX related rules.
	 *
	 * Pass in an object to enable JSX accessibility rules.
	 *
	 * @default true
	 */
	jsx?: (OptionsJSX & OptionsOverrides) | boolean;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * @default true
	 */
	markdown?: (OptionsComponentExts & OptionsFiles & OptionsMarkdown & OptionsOverrides) | boolean;

	/**
	 * Enable linting for node.
	 *
	 * @default true
	 */
	node?: (OptionsAppType & OptionsNode & OptionsOverrides) | boolean;

	/**
	 * Enable `perfectionist` rules.
	 * @default true
	 */
	perfectionist?: boolean | OptionsOverrides;

	/**
	 * Enable pnpm (workspace/catalogs) support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-pnpm`
	 * @see https://github.com/antfu/pnpm-workspace-utils
	 * @default auto-detect based on project usage
	 */
	pnpm?: (OptionsIsInEditor & OptionsPnpm) | boolean;

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 * - `eslint-plugin-react-you-might-not-need-an-effect`
	 *
	 * May require installing:
	 * - `@next/eslint-plugin-next`
	 *
	 * @default auto-detect based on the dependencies
	 */
	react?:
		| (OptionsFiles
				& OptionsHasTypeScript
				& OptionsOverrides
				& OptionsReact
				& Pick<OptionsTypeScriptWithTypes, "filesTypeAware" | "ignoresTypeAware">)
		| boolean;

	/**
	 * Enable regexp rules.
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: (OptionsOverrides & OptionsRegExp) | boolean;

	/**
	 * Enable solid rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-solid`
	 * @default false
	 */
	solid?: (OptionsFiles & OptionsHasTypeScript & OptionsOverrides) | boolean;

	/**
	 * Enable stylistic rules.
	 * @see https://eslint.style/
	 * @default true
	 */
	stylistic?: (OptionsHasJsx & OptionsOverrides) | boolean;

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 * @default false
	 */
	svelte?: boolean;

	/**
	 * Enable TailwindCSS support via [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss).
	 * @deprecated until eslint-plugin-tailwindcss supports tailwindcss v4
	 *
	 * Requires installing:
	 * - `eslint-plugin-tailwindcss`
	 * @default false
	 */
	tailwindcss?: (OptionsOverrides & OptionsTailwindCSS) | boolean;

	/**
	 * Enable TailwindCSS support via [eslint-plugin-better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss).
	 *
	 * Requires installing:
	 * - `eslint-plugin-better-tailwindcss`
	 * @default false
	 */
	tailwindcssBetter?: (OptionsOverrides & OptionsTailwindCSSBetter) | boolean;

	/**
	 * Enable TanStack Query support.
	 *
	 * May require installing the following:
	 * - `@tanstack/eslint-plugin-query`
	 * - `@tanstack/eslint-plugin-router`
	 * @default false
	 */
	tanstack?: (OptionsOverrides & OptionsTanstack) | boolean;

	/**
	 * Enable TOML support.
	 * @default true
	 */
	toml?: (OptionsFiles & OptionsOverrides & OptionsStylistic) | boolean;

	/**
	 * Specify application type
	 * @default "app"
	 */
	type?: OptionsAppType["type"];

	/**
	 * Enable TypeScript support.
	 *
	 * Pass `true` or an options object with a `tsconfigPath` property to enable type aware rules.
	 * @default auto-detect based on the dependencies
	 */
	typescript?:
		| (OptionsFiles
				& OptionsIsInEditor
				& OptionsOverrides
				& OptionsTypescript
				& Pick<OptionsStylistic, "stylistic">)
		| boolean;

	/**
	 * Options for eslint-plugin-unicorn.
	 * @default true
	 */
	unicorn?: (OptionsAppType & OptionsOverrides) | boolean;

	/**
	 * Enable Vue support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-vue`
	 * - `vue-eslint-parser`
	 *
	 * If sfcBlocks is enabled,
	 * - `eslint-processor-vue-blocks`
	 */
	vue?:
		| (OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsStylistic & OptionsVue)
		| boolean;

	/**
	 *  Controls whether or not configs enabled by defaults should stay enabled or not
	 * @default true
	 */
	withDefaults?: boolean;

	/**
	 * Enable YAML support.
	 * @default true
	 */
	yaml?: (OptionsFiles & OptionsOverrides & OptionsStylistic) | boolean;
}
