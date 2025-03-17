import { fileURLToPath } from "node:url";
import type { ESLint, Linter } from "eslint";
import { isPackageExists } from "local-pkg";
import type { Awaitable, Rules, TypedFlatConfigItem } from "./types";

export const isObject = <TObject extends Record<string, unknown>>(value: unknown): value is TObject => {
	return typeof value === "object" && value !== null && !Array.isArray(value);
};

/**
 * @description - Combine array and non-array configs into a single array.
 */
export const combine = async (
	...configs: Array<Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>>
): Promise<TypedFlatConfigItem[]> => {
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
): (Partial<Linter.RulesRecord> & Rules) | undefined => {
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

/**
 * @description - Rename plugin names a flat configs array
 *
 * @example
 * ```ts
 * import { renamePluginInConfigs } from '@zayne-labs/eslint-config'
 * import someConfigs from './some-configs'
 *
 * export default renamePluginInConfigs(someConfigs, {
 *   '@typescript-eslint': 'ts',
 *   'import-x': 'import',
 * })
 * ```
 */
export const renamePluginInConfigs = (
	configs: TypedFlatConfigItem[],
	renameMap: Record<string, string>,
	extraOverrides?: TypedFlatConfigItem
): TypedFlatConfigItem[] => {
	const renamedConfigs = configs.map((config) => ({
		...config,
		...extraOverrides,
		...(isObject(config.rules) && { rules: renameRules(config.rules, renameMap) }),
		...(isObject(config.plugins) && { plugins: renamePlugins(config.plugins, renameMap) }),
	}));

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

export const resolveOptions = <TObject>(option: boolean | TObject | undefined) =>
	isObject(option) ? option : ({} as TObject);
