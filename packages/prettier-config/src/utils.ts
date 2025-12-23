import { isArray, isObject } from "@zayne-labs/toolkit-type-helpers";
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
