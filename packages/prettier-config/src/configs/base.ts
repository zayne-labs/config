import type { ExtractOptions, OptionsConfig } from "@/types";

export const base = (options: ExtractOptions<OptionsConfig["base"]>): typeof options => {
	return {
		experimentalOperatorPosition: "start",
		experimentalTernaries: true,
		jsxSingleQuote: false,
		printWidth: 107,
		singleQuote: false,
		tabWidth: 3,
		trailingComma: "es5",
		useTabs: true,
		...options,
	};
};
