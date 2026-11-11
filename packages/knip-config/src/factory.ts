import { mergeObjects } from "@zayne-labs/toolkit-core";
import { base } from "./configs";
import type { OptionsKnipConfig, ResolvedKnipConfig } from "./types";
import { resolveOptions } from "./utils";

/**
 * @description Factory function for creating a customized Knip configuration.
 * Any Array values (like `entry` and `ignoreDependencies`) are concatenated,
 * plain object values (like `rules` and `workspaces`) are shallowly merged, while other values are overwritten.
 * `undefined` values never overwrite earlier ones.
 *
 * @example
 * ```ts
 * // knip.config.ts
 * import { zayne } from "@zayne-labs/knip-config";
 *
 * export default zayne({
 *   base: true,
 *   // Project-specific config, merged in last (optional)
 *   extend: {
 *     entry: ["src/main.ts"],
 *     ignoreDependencies: ["some-package"],
 *   },
 * });
 * ```
 */
export const zayne = (options: OptionsKnipConfig = {}): ResolvedKnipConfig => {
	const { base: enabledBase = true, extend } = options;

	const configArray: Array<ResolvedKnipConfig | undefined> = [
		enabledBase ? base(resolveOptions(enabledBase)) : undefined,

		extend,
	];

	return mergeObjects(configArray);
};
