import { defineEnum, defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { OptionsTailwindCSSBetter } from "@/types";

export const getDefaultPluginRenameMap = () => {
	return defineEnum({
		"@eslint-react": "react",

		"@next/next": "nextjs",

		"@stylistic": "stylistic",

		"@tanstack/query": "tanstack-query",
		"@tanstack/router": "tanstack-router",

		"@typescript-eslint": "ts-eslint",

		"better-tailwindcss": "tailwindcss-better",

		"import-x": "import",

		n: "node",
	});
};

export const getDefaultAllowedNextJsExportNames = () => {
	return defineEnum([
		"dynamic",
		"dynamicParams",
		"revalidate",
		"fetchCache",
		"runtime",
		"preferredRegion",
		"maxDuration",
		"config",
		"generateStaticParams",
		"metadata",
		"generateMetadata",
		"viewport",
		"generateViewport",
	]);
};

export const getDefaultAllowedReactRouterExportNames = () => {
	return defineEnum([
		"meta",
		"links",
		"headers",
		"loader",
		"action",
		"clientLoader",
		"clientAction",
		"handle",
		"shouldRevalidate",
	]);
};

export const getDefaultTailwindcssBetterSettings = () => {
	return defineEnumDeep({
		entryPoint: `./tailwind.css`, // This will be relative to the process.cwd() since cwd option is undefined by default
		selectors: [
			{
				kind: "attribute",
				match: [{ type: "objectValues" }],
				name: "^classNames$",
			},
			{
				kind: "tag",
				name: "^tw$",
			},
			{
				kind: "callee",
				match: [{ type: "strings" }],
				name: "^cn(Merge|Join)$",
			},
			{
				kind: "callee",
				match: [{ path: "^(?:class|className)$", type: "objectValues" }],
				name: "^get[A-Z][a-zA-Z0-9]*Props$",
			},
		],
	} as const satisfies OptionsTailwindCSSBetter["settings"]);
};

export const getDefaultAllowedDependencies = () => {
	return defineEnum(["lint-staged"]);
};
