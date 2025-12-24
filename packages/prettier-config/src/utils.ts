import { fileURLToPath } from "node:url";
import { isArray, isObject, type Awaitable } from "@zayne-labs/toolkit-type-helpers";
import { isPackageExists } from "local-pkg";
import type { ResolvedPrettierConfig } from "./types";

/**
 * @description Resolves a boolean or object option to an object.
 * If the option is an object, it returns it as-is. Otherwise, returns an empty object.
 */
export const resolveOptions = <TObject>(option: boolean | TObject | undefined) => {
	return isObject(option) ? option : ({} as TObject);
};

/**
 * @description Merges two Prettier configurations.
 * Array values (like `plugins` or `overrides`) are concatenated, while other values from the latter config overwrite the former.
 */
export const mergeTwoConfigs = (
	formerConfig: ResolvedPrettierConfig,
	latterConfig: ResolvedPrettierConfig
): ResolvedPrettierConfig => {
	const configAccumulator: ResolvedPrettierConfig = {
		...formerConfig,
	};

	for (const [latterConfigKey, latterConfigValue] of Object.entries(latterConfig)) {
		const accumulatedConfigValue = configAccumulator[latterConfigKey];

		configAccumulator[latterConfigKey] =
			isArray(latterConfigValue) && isArray(accumulatedConfigValue) ?
				[...accumulatedConfigValue, ...latterConfigValue]
			:	latterConfigValue;
	}

	return configAccumulator;
};

export const combineConfigs = async (
	configArray: Array<Awaitable<ResolvedPrettierConfig | undefined>>
): Promise<ResolvedPrettierConfig> => {
	// eslint-disable-next-line ts-eslint/await-thenable -- Ignore
	const resolvedConfigArray = await Promise.all(configArray);

	let accumulatedConfig: ResolvedPrettierConfig = {};

	for (const config of resolvedConfigArray) {
		if (!config) continue;

		accumulatedConfig = mergeTwoConfigs(accumulatedConfig, config);
	}

	return accumulatedConfig;
};

const scopeUrl = fileURLToPath(new URL(".", import.meta.url));
const isCwdInScope = isPackageExists("@zayne-labs/prettier-config");

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
