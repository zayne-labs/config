import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";

export const getDefaultTailwindSettings = () => {
	return defineEnumDeep({
		tailwindAttributes: ["className", "classNames", "classes"],
		tailwindFunctions: ["cnMerge", "cnJoin", "cn", "tv", "tw"],
		tailwindStylesheet: "./tailwind.css",
	});
};

export const getDefaultImportSortingOrder = () => {
	return defineEnumDeep({
		// CSS files (always last)
		css: ".css$",

		main: [
			// URLs (e.g., https://example.org)
			"^https?://",
			// Protocol imports (node:, bun:, jsr:, npm:, etc.)
			"<BUILTIN_MODULES>",
			"^(bun|jsr|npm):",
			// Third-party packages
			"<THIRD_PARTY_MODULES>",
			// Aliases (@/, @@/, #, ~, $, %)
			"^(@@?/|[#$%~])",
			// Relative and absolute paths (excluding CSS)
			"^(?!.*[.]css$)[./].*$",
		],
	});
};
