/* eslint-disable ts-eslint/consistent-type-definitions -- Users need to be able to override styles, so interfaces are needed */
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import type { Rules } from "../typegen";
import type { FlatESLintConfigItem } from "./eslint-config-types";

export type { ConfigNames, Rules } from "../typegen";

type TypedRules = Omit<Rules, "vue/multiline-ternary">;

/**
 * An updated version of ESLint's `Linter.Config`, which provides autocompletion
 * for `rules` and relaxes type limitations for `plugins`, because
 * many plugins still lack proper type definitions.
 */
export interface TypedFlatConfigItem extends FlatESLintConfigItem {
	// eslint-disable-next-line ts-eslint/no-explicit-any -- Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	plugins?: Record<string, any>;
	rules?: Record<string, Linter.RuleEntry | undefined> & TypedRules;
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
}

interface OptionsOverridesMultiple<TArray extends string[]> {
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

export interface OptionsVue extends OptionsOverrides {
	/**
	 * Create virtual files for Vue SFC blocks to enable linting.
	 * @see https://github.com/antfu/eslint-processor-vue-blocks
	 * @default true
	 */
	sfcBlocks?: boolean | VueBlocksOptions;

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
	parserOptions?: Partial<ParserOptions>;
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
	nextjs?: boolean | OptionsOverrides;

	/**
	 * Enable default react rules.
	 * @default true
	 */
	react?: boolean | OptionsOverrides;

	/**
	 * Enable react-refresh(HMR) rules.
	 * @default true
	 */
	refresh?: boolean | OptionsOverrides;

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

export type TailwindCSSBetterMatcher =
	| string
	| [
			name: string,
			configurations: Array<{
				/**
				 * Type of matcher:
				 * - `objectKeys`: matches all object keys
				 * - `objectValues`: matches all object values
				 * - `strings`: matches all string literals that are not object keys or values
				 */
				match: "objectKeys" | "objectValues" | "strings";
				/**
				 * narrow down which keys/values are matched by providing a path pattern (Regex).
				 * Special characters in the path reflect nesting:
				 * - Dot notation for plain keys: `root.nested.values`
				 * - Square brackets for arrays: `values[0]`
				 * - Quoted brackets for special characters: `root["some-key"]`
				 * @example "^compoundVariants\\[\\d+\\]\\.(?:className|class)$"
				 */
				pathPattern?: string;
			}>,
	  ];

export interface OptionsTailwindCSSBetter {
	settings?: {
		/**
		 * The name of the attribute that contains the tailwind classes.
		 * @default ["class", "className", "^class(Name|Names)?$",]
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#attributes
		 */
		attributes?: TailwindCSSBetterMatcher[];

		/**
		 * List of function names which arguments should also get linted.
		 * @default ["cc", "clb", "clsx", "cn", "cnb", "ctl", "cva", "cx", "dcnb", "objstr", "tv", "twJoin", "twMerge", "cnMerge", "cnJoin"]
		 * @example
		 * ```ts
		 * [
		 *   [
		 *     "cva", [
		 *       { "match": "strings" },
		 *       { "match": "objectValues", "pathPattern": "^compoundVariants\\[\\d+\\]\\.(?:className|class)$" }
		 *     ]
		 *   ]
		 * ]
		 * ```
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#callees
		 */
		callees?: TailwindCSSBetterMatcher[];

		/**
		 * The path to the entry file of the css based tailwind config (eg: src/global.css).
		 * If not specified, the plugin will fall back to the default configuration.
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#entrypoint
		 */
		entryPoint?: string;

		/**
		 * Template literal tag names whose content should get linted.
		 * @default []
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#tags
		 */
		tags?: TailwindCSSBetterMatcher[];

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

		/**
		 * List of variable names whose initializer should also get linted.
		 * @default ["className", "classNames", "classes", "style", "styles"]
		 * @see https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/main/docs/settings/settings.md#variables
		 */
		variables?: TailwindCSSBetterMatcher[];
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
	json?: boolean;

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
	yaml?: boolean;
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
	gitignore?: boolean | FlatGitignoreOptions;

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
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsOverrides;

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
	markdown?: (OptionsComponentExts & OptionsFiles & OptionsOverrides) | boolean;

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
	pnpm?: (OptionsOverridesMultiple<["json", "yaml"]> & OptionsPnpm) | boolean;

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
		| (OptionsFiles & OptionsOverrides & OptionsTypescript & Pick<OptionsStylistic, "stylistic">)
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
