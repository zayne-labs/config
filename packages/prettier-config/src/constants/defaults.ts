import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { OptionsTailwindCss } from "@/types";

export const getDefaultTailwindSettings = () => {
	return defineEnumDeep({
		tailwindAttributes: ["className", "classNames", "classes", "class", "/.*Classes/", "toastOptions"],
		tailwindFunctions: [
			"cnMerge",
			"cnJoin",
			"cn",
			"tv",
			"tw",
			"css",
			"twMerge",
			"twJoin",
			"clsx",
			"/^get[A-Z][a-zA-Z0-9]*Props$/",
		],
		tailwindStylesheet: "./tailwind.css",
	}) satisfies OptionsTailwindCss;
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
