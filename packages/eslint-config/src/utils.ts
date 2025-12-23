import { isFunction, isObjectAndNotArray } from "@zayne-labs/toolkit-type-helpers";
import type { ESLint } from "eslint";
import { isPackageExists } from "local-pkg";
import { fileURLToPath } from "node:url";
import type { Awaitable, TypedFlatConfigItem } from "./types";

export const isObject = <TObject extends object>(value: unknown): value is TObject => {
	return isObjectAndNotArray(value);
};

/**
 * @description - Combine array and non-array configs into a single array.
 */
export const combine = async (
	...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): Promise<TypedFlatConfigItem[]> => {
	// eslint-disable-next-line ts-eslint/await-thenable -- False positive
	const resolved = await Promise.all(configs);

	return resolved.flat();
};

export const interopDefault = async <TModule>(
	module: Awaitable<TModule>
): Promise<TModule extends { default: infer TDefaultExport } ? TDefaultExport : TModule> => {
	const resolved = await module;

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- casting is necessary to prevent assignability ts issues at call-site
	return (resolved as { default: never }).default ?? resolved;
};

/**
 * @description - Rename plugin prefixes in a rule object.
 * Accepts a map of prefixes to rename.
 *
 * @example
 * ```ts
 * import { renameRules } from '@zayne-labs/eslint-config'
 *
 * export default [{
 *   rules: renameRules(
 *     {
 *       '@typescript-eslint/indent': 'error'
 *     },
 *     { '@typescript-eslint': 'ts' }
 *   )
 * }]
 * ```
 */
export const renameRules = (
	rules: Record<string, unknown> | undefined,
	renameMap: Record<string, string>
): TypedFlatConfigItem["rules"] | undefined => {
	if (!rules) return;

	const renamedRulesEntries = Object.entries(rules).map(([ruleKey, ruleValue]) => {
		for (const [oldRuleName, newRuleName] of Object.entries(renameMap)) {
			if (ruleKey.startsWith(`${oldRuleName}/`)) {
				return [`${newRuleName}${ruleKey.slice(oldRuleName.length)}`, ruleValue];
			}
		}

		return [ruleKey, ruleValue];
	});

	return Object.fromEntries(renamedRulesEntries) as TypedFlatConfigItem["rules"];
};

export const renamePlugins = (
	plugins: Record<string, unknown> | undefined,
	renameMap: Record<string, string>
): Record<string, ESLint.Plugin> | undefined => {
	if (!plugins) return;

	const renamedPluginEntries = Object.entries(plugins).map(([pluginKey, pluginValue]) => {
		if (pluginKey in renameMap) {
			return [renameMap[pluginKey], pluginValue];
		}

		return [pluginKey, pluginValue];
	});

	return Object.fromEntries(renamedPluginEntries) as Record<string, ESLint.Plugin>;
};

type OverrideConfigsOptions = {
	configArray: TypedFlatConfigItem[];
	overrides: TypedFlatConfigItem | ((config: TypedFlatConfigItem) => TypedFlatConfigItem);
};

const getResolvedOverrides = (options: {
	configItem: TypedFlatConfigItem;
	overrides: OverrideConfigsOptions["overrides"] | undefined;
}) => {
	const { configItem, overrides } = options;

	return isFunction(overrides) ? overrides(configItem) : overrides;
};

/**
 * @description - Override configurations in a flat configs array with either a static config object or a function that returns a config object
 * @param options - Configuration options
 * @param options.configs - Array of flat config items to override
 * @param options.overrides - Either a config object to merge or a function that takes a config and returns overrides
 * @returns Array of merged config items with overrides applied
 *
 * @example
 * ```ts
 * import { overrideConfigs } from '@zayne-labs/eslint-config'
 *
 * // Override with static config
 * overrideConfigs({
 *   configArray: existingConfigs,
 *   overrides: {
 *     rules: {
 *       'no-console': 'error'
 *     }
 *   }
 * })
 *
 * // Override with function
 * overrideConfigs({
 *   configArray: existingConfigs,
 *   overrides: (config) => ({
 *     ...config,
 *     rules: {
 *       ...config.rules,
 *       'no-console': 'error'
 *     }
 *   })
 * })
 * ```
 */
export const overrideConfigs = (options: OverrideConfigsOptions): TypedFlatConfigItem[] => {
	const { configArray, overrides } = options;

	return configArray.map((configItem) => ({
		...configItem,
		...getResolvedOverrides({ configItem, overrides }),
	}));
};

type RenamePluginInConfigsOptions = {
	configArray: OverrideConfigsOptions["configArray"];
	overrides?: OverrideConfigsOptions["overrides"];
	renameMap: Record<string, string>;
};

/**
 * @description - Rename plugin names and rules in a flat configs array
 *
 * @param options - Configuration options
 * @param options.configArray - Array of flat config items to process
 * @param options.overrides - Optional config overrides to apply
 * @param options.renameMap - Map of old plugin names to new names
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from '@zayne-labs/eslint-config'
 * import someConfigs from './some-configs'
 *
 * renamePluginInConfigs({
 *   configArray: someConfigs,
 *   renameMap: {
 *     '@typescript-eslint': 'ts',
 *     'import-x': 'import',
 *   }
 * })
 * ```
 */

export const renamePluginInConfigs = (options: RenamePluginInConfigsOptions): TypedFlatConfigItem[] => {
	const { configArray, overrides, renameMap } = options;

	const renamedConfigs = overrideConfigs({
		configArray,
		overrides: (configItem) => ({
			...getResolvedOverrides({ configItem, overrides }),

			...(isObject(configItem.plugins) && {
				plugins: renamePlugins(configItem.plugins, renameMap),
			}),
			...(isObject(configItem.rules) && {
				rules: renameRules(configItem.rules, renameMap),
			}),
		}),
	});

	return renamedConfigs;
};

const scopeUrl = fileURLToPath(new URL(".", import.meta.url));
const isCwdInScope = isPackageExists("@zayne-labs/eslint-config");

export const isPackageInScope = (name: string): boolean => isPackageExists(name, { paths: [scopeUrl] });

/**
 * @description
 * - Ensures that packages are installed in the current scope.
 * - If they are not installed, and the user is in a TTY, and the user is not in a CI environment,
 * and the user is in the same scope as this package, then prompt the user to
 * install the packages.
 *
 * @param packages - The packages to ensure are installed.
 */
export const ensurePackages = async (packages: Array<string | undefined>): Promise<void> => {
	if (process.env.CI || !process.stdout.isTTY || !isCwdInScope) return;

	const nonExistingPackages = packages.filter((pkg) => pkg && !isPackageInScope(pkg));

	if (nonExistingPackages.length === 0) return;

	const clackPrompt = await import("@clack/prompts");

	const result = await clackPrompt.confirm({
		message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
	});

	if (result) {
		const antfuPkg = await import("@antfu/install-pkg");

		await antfuPkg.installPackage(nonExistingPackages as string[], { dev: true });
	}
};

export const resolveOptions = <TObject>(option: boolean | TObject | undefined) => {
	return isObject(option) ? option : ({} as TObject);
};

export const parserPlain = {
	meta: {
		name: "parser-plain",
	},
	parseForESLint: (code: string) => ({
		ast: {
			body: [],
			comments: [],
			loc: { end: code.length, start: 0 },
			range: [0, code.length],
			tokens: [],
			type: "Program",
		},
		scopeManager: null,
		services: { isPlain: true },
		visitorKeys: {
			Program: [],
		},
	}),
};
