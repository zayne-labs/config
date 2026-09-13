// import fsPromises from "node:fs/promises";
// import { findUp } from "find-up-simple";
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, isObject } from "@/utils";

// const detectCatalogUsage = async (): Promise<boolean> => {
// 	const workspaceFilePath = await findUp("pnpm-workspace.yaml");

// 	if (!workspaceFilePath) {
// 		return false;
// 	}

// 	const yaml = await fsPromises.readFile(workspaceFilePath, "utf8");

// 	return yaml.includes("catalog:") || yaml.includes("catalogs:");
// };

export async function pnpm(
	options: ExtractOptions<OptionsConfig["pnpm"]> = {}
): Promise<TypedFlatConfigItem[]> {
	const {
		// catalogs = await detectCatalogUsage(),
		catalogs = false,
		isInEditor = true,
		json = true,
		sort = true,
		stylistic = true,
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
					"pnpm/json-enforce-catalog": [
						"error",
						{
							autofix: !isInEditor,
							ignores: ["@types/vscode"],
						},
					],
				}),
				"pnpm/json-prefer-workspace-settings": [
					"error",
					{
						autofix: !isInEditor,
					},
				],
				"pnpm/json-valid-catalog": [
					"error",
					{
						autofix: !isInEditor,
					},
				],

				...(isObject(json) && json.overrides),
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
				"pnpm/yaml-enforce-settings": [
					"error",
					{
						settings: {
							minimumReleaseAgeExcludePrune: true,
						},
					},
				],
				"pnpm/yaml-no-duplicate-catalog-item": "error",
				"pnpm/yaml-no-unused-catalog-item": "error",

				...(isObject(yaml) && yaml.overrides),
			},
		});
	}

	if (yaml && stylistic) {
		configs.push({
			files: ["pnpm-workspace.yaml"],

			languageOptions: {
				parser: yamlParser,
			},

			name: "zayne/pnpm/pnpm-workspace-yaml/stylistic/rules",

			plugins: {
				pnpm: eslintPluginPnpm,
			},

			rules: {
				"pnpm/yaml-blank-lines": "warn",

				...(isObject(yaml) && yaml.overrides),
			},
		});
	}

	if (yaml && sort) {
		configs.push({
			files: ["pnpm-workspace.yaml"],

			languageOptions: {
				parser: yamlParser,
			},

			name: "zayne/pnpm/pnpm-workspace-yaml/sort/rules",

			plugins: {
				yaml: eslintPluginYaml,
			},

			rules: {
				"yaml/sort-keys": [
					"error",
					{
						order: [
							// Workspace
							// @keep-sorted
							...defineEnum([
								"dedupeInjectedDeps",
								"disallowWorkspaceCycles",
								"failIfNoMatch",
								"ignoreWorkspaceCycles",
								"ignoreWorkspaceRootCheck",
								"includeWorkspaceRoot",
								"injectWorkspacePackages",
								"legacyDirFiltering",
								"linkWorkspacePackages",
								"preferWorkspacePackages",
								"saveWorkspaceProtocol",
								"sharedWorkspaceLockfile",
								"syncInjectedDepsAfterScripts",
							]),

							// Catalogs
							// @keep-sorted
							...defineEnum(["catalogMode", "catalogPrune", "cleanupUnusedCatalogs"]),

							// Dependency resolution
							...defineEnum([
								"allowedDeprecatedVersions",
								"blockExoticSubdeps",
								"ignoredOptionalDependencies",
								"minimumReleaseAge",
								"minimumReleaseAgeIgnoreMissingTime",
								"minimumReleaseAgeStrict",
								"minimumReleaseAgeExcludePrune",
								"minimumReleaseAgeExclude",
								"registrySupportsTimeField",
								"resolutionMode",
								"supportedArchitectures",
								"trustLockfile",
								"trustPolicy",
								"trustPolicyIgnoreAfter",
								"trustPolicyExclude",
								"update",
							]),

							// Peer dependencies
							// @keep-sorted
							...defineEnum([
								"autoInstallPeers",
								"dedupePeerDependents",
								"dedupePeers",
								"peerDependencyRules",
								"resolvePeersFromWorkspaceRoot",
								"strictPeerDependencies",
							]),

							// Registry and network
							// @keep-sorted
							...defineEnum([
								"fetchMinSpeedKiBps",
								"fetchRetries",
								"fetchRetryFactor",
								"fetchRetryMaxtimeout",
								"fetchRetryMintimeout",
								"fetchTimeout",
								"fetchWarnTimeoutMs",
								"gitShallowHosts",
								"httpProxy",
								"httpsProxy",
								"localAddress",
								"maxsockets",
								"namedRegistries",
								"networkConcurrency",
								"noProxy",
								"registries",
								"registry",
								"strictSsl",
							]),

							// node_modules
							// @keep-sorted
							...defineEnum([
								"dlxCacheMaxAge",
								"enableGlobalVirtualStore",
								"enableModulesDir",
								"extendNodePath",
								"modulesCacheMaxAge",
								"modulesDir",
								"nodeExperimentalPackageMap",
								"nodeLinker",
								"nodePackageMapType",
								"packageImportMethod",
								"preferSymlinkedExecutables",
								"symlink",
								"virtualStoreDir",
								"virtualStoreDirMaxLength",
								"virtualStoreOnly",
								"virtualStoreType",
							]),

							// Hoisting
							// @keep-sorted
							...defineEnum([
								"hoist",
								"hoistingLimits",
								"hoistPattern",
								"hoistWorkspacePackages",
								"publicHoistPattern",
								"shamefullyHoist",
							]),

							// Store
							// @keep-sorted
							...defineEnum([
								"frozenStore",
								"storeDir",
								"strictStorePkgContentCheck",
								"useRunningStoreServer",
								"verifyStoreIntegrity",
							]),

							// Lockfile
							// @keep-sorted
							...defineEnum([
								"gitBranchLockfile",
								"lockfile",
								"lockfileIncludeTarballUrl",
								"mergeGitBranchLockfilesBranchPattern",
								"peersSuffixMaxLength",
								"preferFrozenLockfile",
							]),

							// Scripts and builds
							// @keep-sorted
							...defineEnum([
								"childConcurrency",
								"dangerouslyAllowAllBuilds",
								"enablePrePostScripts",
								"ignoreDepScripts",
								"ignoreScripts",
								"nodeOptions",
								"requiredScripts",
								"scriptShell",
								"shellEmulator",
								"sideEffectsCache",
								"sideEffectsCacheReadonly",
								"strictDepBuilds",
								"unsafePerm",
								"verifyDepsBeforeRun",
							]),

							// Node.js and package manager versions
							// @keep-sorted
							...defineEnum([
								"managePackageManagerVersions",
								"nodeDownloadMirrors",
								"nodeVersion",
								"packageManagerStrict",
								"packageManagerStrictVersion",
								"pmOnFail",
								"runtimeOnFail",
							]),

							// CLI and output
							// @keep-sorted
							...defineEnum([
								"ci",
								"color",
								"engineStrict",
								"loglevel",
								"npmPath",
								"recursiveInstall",
								"updateNotifier",
								"useBetaCli",
								"useStderr",
							]),

							// Directories and pnpmfile
							// @keep-sorted
							...defineEnum([
								"cacheDir",
								"globalBinDir",
								"globalDir",
								"globalPnpmfile",
								"globalShims",
								"ignorePnpmfile",
								"npmrcAuthFile",
								"pnpmfile",
								"stateDir",
							]),

							// Audit and versioning
							// @keep-sorted
							...defineEnum(["audit", "versioning"]),

							// Misc
							// @keep-sorted
							...defineEnum([
								"allowNonAppliedPatches",
								"dedupeDirectDeps",
								"deployAllFiles",
								"ignoreCompatibilityDb",
								"initAuthorEmail",
								"initAuthorName",
								"initAuthorUrl",
								"initLicense",
								"initVersion",
								"optimisticRepeatInstall",
								"saveExact",
								"savePrefix",
								"tag",
							]),

							// Workspace layout and dependency declarations, ordered by how
							// a `pnpm-workspace.yaml` usually reads top to bottom
							"packages",
							"packageConfigs",
							"overrides",
							"packageExtensions",
							"patchedDependencies",
							"configDependencies",

							// Build approvals
							"allowBuilds",
							// Superseded by `allowBuilds` in pnpm v11
							// @keep-sorted
							...defineEnum([
								"ignoredBuiltDependencies",
								"neverBuiltDependencies",
								"onlyBuiltDependencies",
								"onlyBuiltDependenciesFile",
							]),

							// Catalogs, usually the largest blocks
							"catalog",
							"catalogs",
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
