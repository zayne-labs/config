// import fs from "node:fs/promises";
// import { findUp } from "find-up-simple";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

// const detectCatalogUsage = async (): Promise<boolean> => {
// 	const workspaceFile = await findUp("pnpm-workspace.yaml");

// 	if (!workspaceFile) {
// 		return false;
// 	}

// 	const yaml = await fs.readFile(workspaceFile, "utf8");

// 	return yaml.includes("catalog:") || yaml.includes("catalogs:");
// };

export async function pnpm(
	options: ExtractOptions<OptionsConfig["pnpm"]> = {}
): Promise<TypedFlatConfigItem[]> {
	const {
		// catalogs = await detectCatalogUsage(),
		catalogs = false,
		json = true,
		overrides,
		sort = true,
		yaml = true,
	} = options;

	await ensurePackages(["eslint-plugin-pnpm"]);

	const [eslintPluginPnpm, yamlParser, eslintPluginYaml, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-pnpm")),
		interopDefault(import("yaml-eslint-parser")),
		interopDefault(import("eslint-plugin-yml")),
		interopDefault(import("jsonc-eslint-parser")),
	]);

	const configs: TypedFlatConfigItem[] = [];

	if (json) {
		configs.push({
			files: ["package.json", "**/package.json"],

			languageOptions: {
				parser: jsoncParser,
			},

			name: "zayne/pnpm/package-json/rules",

			plugins: {
				pnpm: eslintPluginPnpm,
			},

			rules: {
				...(catalogs && {
					"pnpm/json-enforce-catalog": ["error", { ignores: ["@types/vscode"] }],
				}),
				"pnpm/json-prefer-workspace-settings": "error",
				"pnpm/json-valid-catalog": "error",

				...overrides?.json,
			},
		});
	}

	if (yaml) {
		configs.push({
			files: ["pnpm-workspace.yaml"],

			languageOptions: {
				parser: yamlParser,
			},

			name: "zayne/pnpm/pnpm-workspace-yaml/rules",

			plugins: {
				pnpm: eslintPluginPnpm,
			},

			rules: {
				// "pnpm/yaml-enforce-settings": [
				// 	"error",
				// 	{
				// 		settings: {
				// 			shellEmulator: true,
				// 			trustPolicy: "no-downgrade",
				// 		},
				// 	},
				// ],
				"pnpm/yaml-no-duplicate-catalog-item": "error",
				"pnpm/yaml-no-unused-catalog-item": "error",

				...overrides?.yaml,
			},
		});
	}

	if (yaml && sort) {
		configs.push({
			files: ["pnpm-workspace.yaml"],
			languageOptions: {
				parser: yamlParser,
			},
			name: "zayne/pnpm/sort/pnpm-workspace-yaml",

			plugins: {
				yaml: eslintPluginYaml,
			},

			rules: {
				"yaml/sort-keys": [
					"error",
					{
						order: [
							// Settings
							// @keep-sorted
							"cacheDir",
							"catalogMode",
							"cleanupUnusedCatalogs",
							"dedupeDirectDeps",
							"deployAllFiles",
							"enablePrePostScripts",
							"engineStrict",
							"extendNodePath",
							"hoist",
							"hoistPattern",
							"hoistWorkspacePackages",
							"ignoreCompatibilityDb",
							"ignoreDepScripts",
							"ignoreScripts",
							"ignoreWorkspaceRootCheck",
							"managePackageManagerVersions",
							"minimumReleaseAge",
							"minimumReleaseAgeExclude",
							"modulesDir",
							"nodeLinker",
							"nodeVersion",
							"optimisticRepeatInstall",
							"packageManagerStrict",
							"packageManagerStrictVersion",
							"preferSymlinkedExecutables",
							"preferWorkspacePackages",
							"publicHoistPattern",
							"registrySupportsTimeField",
							"requiredScripts",
							"resolutionMode",
							"savePrefix",
							"scriptShell",
							"shamefullyHoist",
							"shellEmulator",
							"stateDir",
							"supportedArchitectures",
							"symlink",
							"tag",
							"trustPolicy",
							"trustPolicyExclude",
							"updateNotifier",

							// Packages and dependencies
							"packages",
							"overrides",
							"patchedDependencies",
							"catalog",
							"catalogs",

							// Other
							// @keep-sorted
							"allowedDeprecatedVersions",
							"allowNonAppliedPatches",
							"configDependencies",
							"ignoredBuiltDependencies",
							"ignoredOptionalDependencies",
							"neverBuiltDependencies",
							"onlyBuiltDependencies",
							"onlyBuiltDependenciesFile",
							"packageExtensions",
							"peerDependencyRules",
						],
						pathPattern: "^$",
					},
					{
						order: { type: "asc" },
						pathPattern: ".*",
					},
				],
			},
		});
	}

	return configs;
}
