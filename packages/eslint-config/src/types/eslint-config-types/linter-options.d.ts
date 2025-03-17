import type { Linter } from "eslint";

/**
 * An object containing settings related to the linting process.
 */
export interface LinterOptions extends Linter.LinterOptions {
	/**
	 * A boolean value indicating if inline configuration is allowed.
	 *
	 * @see [Disabling inline configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#disabling-inline-configuration)
	 */
	noInlineConfig?: Linter.LinterOptions["noInlineConfig"];

	/**
	 * A boolean value indicating if unused disable directives should be tracked and reported.
	 *
	 * @see [Reporting unused disable directives](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#reporting-unused-disable-directives)
	 */
	reportUnusedDisableDirectives?: Linter.LinterOptions["reportUnusedDisableDirectives"];
}
