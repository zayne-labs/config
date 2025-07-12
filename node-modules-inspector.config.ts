import { defineConfig } from "node-modules-inspector";

export default defineConfig({
	defaultFilters: {
		// sourceType: "prod",
	},
	defaultSettings: {
		showFileComposition: true,
		showInstallSizeBadge: true,
		showPublishTimeBadge: true,
	},
	excludeDependenciesOf: ["eslint", "@typescript-eslint/eslint-plugin", "@typescript-eslint/utils"],
	excludePackages: ["typescript", "lint-staged", "husky", "turbo", "tsdown", "tsx"],
	name: "@zayne-labs/config",
	publint: true,
});
