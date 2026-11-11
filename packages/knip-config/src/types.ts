import type { KnipConfiguration } from "knip";

/**
 * @description The resolved (object form) Knip configuration, as accepted in `knip.config.ts`.
 * Sourced from Knip itself, so every option stays in sync with the installed `knip` version.
 */
export type ResolvedKnipConfig = KnipConfiguration;

// eslint-disable-next-line ts-eslint/consistent-type-definitions -- Allow
export interface OptionsKnipConfig {
	/**
	 * Base Knip configuration with opinionated defaults.
	 * Pass an object to override or extend the defaults.
	 *
	 * @default true
	 */
	base?: boolean | ResolvedKnipConfig;

	/**
	 * Project-specific Knip config, merged in last (after `base`).
	 *
	 * @example
	 * ```ts
	 * zayne({ extend: { entry: ["src/main.ts"], ignoreDependencies: ["some-package"] } });
	 * ```
	 */
	extend?: ResolvedKnipConfig;
}

export type ExtractOptions<TUnion> = Extract<TUnion, object>;
