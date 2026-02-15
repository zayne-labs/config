import { defineEnum, defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { OptionsTailwindCSSBetter } from "@/types";

export const getDefaultPluginRenameMap = () => {
	return defineEnum({
		"@eslint-react": "react-x",
		"@eslint-react/debug": "react-debug",
		"@eslint-react/dom": "react-dom",
		"@eslint-react/hooks-extra": "react-hooks-extra",
		"@eslint-react/naming-convention": "react-naming-convention",
		"@eslint-react/rsc": "react-rsc",

		"@eslint-react/web-api": "react-web-api",

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
		attributes: ["classNames", "classes"],
		callees: ["cnMerge", "cnJoin"],
	} satisfies OptionsTailwindCSSBetter["settings"]);
};

export const getDefaultAllowedDependencies = () => {
	return defineEnum(["lint-staged"]);
};
