import { mergeTwoObjects } from "@zayne-labs/toolkit-core";
import type { ExtractOptions, OptionsKnipConfig } from "@/types";

export const base = (options: ExtractOptions<OptionsKnipConfig["base"]>): typeof options => {
	const defaults: typeof options = {
		/**
		 * Types and interfaces are commonly exported for consumers while also being used locally,
		 * so don't report those as unused when they're referenced in the same file.
		 */
		ignoreExportsUsedInFile: {
			interface: true,
			type: true,
		},
	};

	// == Merged (not spread) so nested objects like `ignoreExportsUsedInFile` extend the defaults,
	// == while booleans (e.g. `ignoreExportsUsedInFile: false`) still replace them
	return mergeTwoObjects(defaults, options);
};
