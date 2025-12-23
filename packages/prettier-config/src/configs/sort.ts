import type { ExtractOptions, OptionsPrettierConfig } from "@/types";

export const sortImports = (
	options: ExtractOptions<OptionsPrettierConfig["sortImports"]>
): typeof options => {
	return {
		...options,

		importOrder: [
			// URLs (e.g., https://example.org)
			"^https?://",
			// Protocol imports (node:, bun:, jsr:, npm:, etc.)
			"<BUILTIN_MODULES>",
			"^(bun|jsr|npm):",
			// Third-party packages
			"<THIRD_PARTY_MODULES>",
			// Aliases (@/, #, ~, $, %)
			"^(@/|[#~$%])",
			// Relative and absolute paths (excluding CSS)
			"^(?!.*[.]css$)[./].*$",

			...(options.importOrder ?? []),

			// CSS files (always last)
			".css$",
		],
		importOrderSafeSideEffects: [".css$", ...(options.importOrderSafeSideEffects ?? [])],

		plugins: ["@ianvs/prettier-plugin-sort-imports", ...(options.plugins ?? [])],
	};
};
