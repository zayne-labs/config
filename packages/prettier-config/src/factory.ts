import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import { astro, base, sortImports, tailwindcss } from "./configs";
import type { OptionsPrettierConfig, ResolvedPrettierConfig } from "./types";
import { combineConfigs, resolveOptions } from "./utils";

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
 * export default zayne({
 *   base: true,
 *   tailwindcss: { tailwindStylesheet: "./src/styles.css" },
 *   astro: true,
 *   // Project-specific config, merged in last (optional)
 *   extend: {
 *     useTabs: false,
 *   },
 * });
 * ```
 */
export const zayne = async (options: OptionsPrettierConfig = {}) => {
	const {
		astro: enabledAstro = false,
		base: enabledBase = true,
		extend,
		sortImports: enabledSortImports = true,
		tailwindcss: enabledTailwindcss = false,
	} = options;

	const configArray: Array<Awaitable<ResolvedPrettierConfig | undefined>> = [
		enabledBase ? base(resolveOptions(enabledBase)) : undefined,
		enabledAstro ? astro(resolveOptions(enabledAstro)) : undefined,
		enabledSortImports ? sortImports(resolveOptions(enabledSortImports)) : undefined,

		extend,

		/**
		 * Tailwind plugin most always be the last one to avoid conflicts
		 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
		 */
		enabledTailwindcss ? tailwindcss(resolveOptions(enabledTailwindcss)) : undefined,
	];

	const accumulatedConfig = await combineConfigs(configArray);

	return accumulatedConfig;
};
