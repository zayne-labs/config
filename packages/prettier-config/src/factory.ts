import { astro, base, tailwindcss } from "./configs";
import type { OptionsConfig, ResolvedPrettierConfig } from "./types";
import { mergeTwoConfigs, resolveOptions } from "./utils";

/**
 * @description Factory function for creating a customized Prettier configuration.
 * Combines base, Astro, and Tailwind CSS configurations based on the provided options.
 * Any Array values (like `plugins` and `overrides`) are merged, while other values are overwritten.
 *
 * @example
 * ```ts
 * // prettier.config.ts
 * import { zayne } from "@zayne-labs/prettier-config";
 *
 * export default zayne(
 *   {
 *     base: true,
 *     tailwindcss: { tailwindStylesheet: "./src/styles.css" },
 *     astro: true,
 *   },
 *     // Extra config to merge (optional)
 *   {
 *     semi: false,
 *   }
 * );
 * ```
 */
export const zayne = (options: OptionsConfig = {}, ...extraConfigs: ResolvedPrettierConfig[]) => {
	const {
		astro: enabledAstro = false,
		base: enabledBase = true,
		tailwindcss: enabledTailwindcss = false,
	} = options;

	const configArray: Array<ResolvedPrettierConfig | undefined> = [
		enabledBase ? base(resolveOptions(enabledBase)) : undefined,
		enabledTailwindcss ? tailwindcss(resolveOptions(enabledTailwindcss)) : undefined,
		enabledAstro ? astro(resolveOptions(enabledAstro)) : undefined,
		...extraConfigs,
	];

	let resolvedConfig: ResolvedPrettierConfig = {};

	for (const config of configArray) {
		if (!config) continue;

		resolvedConfig = mergeTwoConfigs(resolvedConfig, config);
	}

	return resolvedConfig;
};
