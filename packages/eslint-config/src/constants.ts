import { defineEnum } from "@zayne-labs/toolkit-type-helpers";

export const defaultPluginRenameMap = defineEnum({
	"@eslint-react/debug": "react-debug",
	"@eslint-react/dom": "react-dom",
	"@eslint-react/hooks-extra": "react-hooks-extra",
	"@eslint-react/naming-convention": "react-naming-convention",
	"@eslint-react/web-api": "react-web-api",
	/* eslint-disable perfectionist/sort-objects -- @eslint-react has to be below the rest to avoid plugin rename issues */
	"@eslint-react": "react",
	/* eslint-enable perfectionist/sort-objects -- @eslint-react has to be below the rest to avoid plugin rename issues */

	"@next/next": "nextjs-next",

	"@stylistic": "stylistic",

	"@tanstack/query": "tanstack-query",

	"@tanstack/router": "tanstack-router",

	"@typescript-eslint": "ts-eslint",

	"better-tailwindcss": "tailwindcss-better",

	"import-x": "import",

	n: "node",
});
