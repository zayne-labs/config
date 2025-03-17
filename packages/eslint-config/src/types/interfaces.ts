/* eslint-disable ts-eslint/consistent-type-definitions -- Users need to be able to override styles, so interfaces are needed */
import type { ParserOptions } from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import type { Options as VueBlocksOptions } from "eslint-processor-vue-blocks";
import type { Rules } from "../typegen";
import type { FlatESLintConfigItem } from "./eslint-config-types";

export type { ConfigNames, Rules } from "../typegen";

export interface TypedFlatConfigItem extends FlatESLintConfigItem<Partial<Linter.RulesRecord> & Rules> {
	// eslint-disable-next-line ts-eslint/no-explicit-any -- Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	plugins?: Record<string, any>;
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"];
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

	/**
	 * Additional extensions for type aware components.
	 * @example ['vue']
	 * @default []
	 */
	componentExtsTypeAware?: string[];
}

export interface OptionsTypeScriptParserOptions {
	/**
	 *	Default projects to allow in the parser project service.
	 * Ensure you don't use more than 8 defaultProjects.
	 */
	allowDefaultProjects?: [string?, string?, string?, string?, string?, string?, string?, string?];

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
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>;
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: true | string | string[];
}

export type OptionsTypescript = OptionsComponentExts
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
	 * @default false
	 */
	compiler?: boolean;

	/**
	 * Enable nextjs rules.
	 * @default auto-detect-from-dependencies
	 */
	nextjs?: boolean;

	/**
	 * Enable react-refresh(HMR) rules.
	 * @default true
	 */
	refresh?: boolean;
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
	 * @default false
	 */
	query?: boolean;
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
	security?: boolean;
}

export interface OptionsConfig extends OptionsComponentExts {
	/**
	 * Enable ASTRO support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * Requires installing for formatting .astro:
	 * - `prettier-plugin-astro`
	 * @default false
	 */
	astro?: boolean | OptionsOverrides;

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
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 * @default true
	 */
	gitignore?: boolean | FlatGitignoreOptions;

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
	jsonc?: (OptionsFiles & OptionsOverrides & OptionsStylistic) | boolean;

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 * @default true
	 */
	jsx?: boolean;

	/**
	 * Enable linting for **code snippets** in Markdown.
	 *
	 * @default true
	 */
	markdown?: boolean | OptionsOverrides;

	/**
	 * Enable linting for node.
	 *
	 * @default true
	 */
	node?: (OptionsNode & OptionsOverrides) | boolean;

	/**
	 * Enable `perfectionist` rules.
	 * @default true
	 */
	perfectionist?: boolean | OptionsOverrides;

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-hooks`
	 * - `eslint-plugin-react-refresh`
	 *
	 * May require installing:
	 * - `@next/eslint-plugin-next`
	 *
	 * @default auto-detect based on the dependencies
	 */
	react?: (OptionsFiles & OptionsHasTypeScript & OptionsOverrides & OptionsReact) | boolean;

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
	 * Enable TailwindCSS support.
	 * @default false
	 */
	tailwindcss?: (OptionsOverrides & OptionsTailwindCSS) | boolean;

	/**
	 * Enable TanStack Query support.
	 *
	 * Might require installing the following:
	 * - `@tanstack/eslint-plugin-query`
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
	 * Passing an object to enable TypeScript Language Server support.
	 * @default auto-detect based on the dependencies
	 */
	typescript?: (OptionsFiles & OptionsOverrides & OptionsStylistic & OptionsTypescript) | boolean;

	/**
	 * Options for eslint-plugin-unicorn.
	 * @default true
	 */
	unicorn?: boolean | OptionsOverrides;

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
