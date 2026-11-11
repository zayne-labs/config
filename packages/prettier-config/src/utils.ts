import { fileURLToPath } from "node:url";
import { mergeObjects, mergeTwoObjects } from "@zayne-labs/toolkit-core";
import { isObject, type Awaitable } from "@zayne-labs/toolkit-type-helpers";
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
 * Array values (like `plugins` or `overrides`) are concatenated, plain objects are shallowly merged,
 * while other values from the latter config overwrite the former. `undefined` values never overwrite.
 */
export const mergeTwoConfigs = (
	formerConfig: ResolvedPrettierConfig,
	latterConfig: ResolvedPrettierConfig
): ResolvedPrettierConfig => mergeTwoObjects(formerConfig, latterConfig);

export const interopDefault = async <TModule>(
	module: Awaitable<TModule>
): Promise<TModule extends { default: infer TDefaultExport } ? TDefaultExport : TModule> => {
	const resolved = await module;

	// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- casting is necessary to prevent assignability ts issues at call-site
	return (resolved as { default: never }).default ?? resolved;
};

export const combineConfigs = async (
	configArray: Array<Awaitable<ResolvedPrettierConfig | undefined>>
): Promise<ResolvedPrettierConfig> => {
	// eslint-disable-next-line ts-eslint/await-thenable -- Ignore
	const resolvedConfigArray = await Promise.all(configArray);

	return mergeObjects(resolvedConfigArray);
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
	if (!isCwdInScope || process.env.CI || !process.stdout.isTTY) return;

	const nonExistingPackages = packages.filter((pkg) => pkg && !isPackageInScope(pkg));

	if (nonExistingPackages.length === 0) return;

	const clackPrompt = await import("@clack/prompts");

	const result = await clackPrompt.confirm({
		message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
	});

	if (!result) return;

	const antfuPkg = await import("@antfu/install-pkg");

	await antfuPkg.installPackage(nonExistingPackages as string[], { dev: true });
};
