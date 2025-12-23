import type { ExtractOptions, OptionsPrettierConfig } from "@/types";

export const base = (options: ExtractOptions<OptionsPrettierConfig["base"]>): typeof options => {
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
