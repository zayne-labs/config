import { zayne } from "@zayne-labs/knip-config";

export default zayne({
	extend: {
		workspaces: {
			".": {
				// == Lint fixtures are intentionally standalone, so treat them as entry files
				entry: ["fixtures/**/*.{ts,tsx,vue}"],
				// == Read by prettier-plugin-tailwindcss as the default `tailwindStylesheet`
				ignoreFiles: ["tailwind.css"],
			},

			"packages/eslint-config": {
				// == Loaded by name at runtime via import-x's `"import-x/resolver": { typescript: true }` setting
				ignoreDependencies: ["eslint-import-resolver-typescript"],
			},
		},
	},
});
