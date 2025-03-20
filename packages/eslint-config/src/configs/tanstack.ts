import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { createOverrideRules, ensurePackages, interopDefault, renameRules } from "@/utils";
import { defineConfig } from "eslint/config";
import { defaultPluginRenameMap } from "../constants";

const tanstack = async (
	options: ExtractOptions<OptionsConfig["tanstack"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, query = true } = options;

	const config: TypedFlatConfigItem[] = [];

	await ensurePackages([...(query ? ["@tanstack/eslint-plugin-query"] : [])]);

	const [eslintPluginTanstackQuery] = await Promise.all(
		query ? [interopDefault(import("@tanstack/eslint-plugin-query"))] : []
	);

	if (query && eslintPluginTanstackQuery) {
		config.push({
			name: "zayne/tanstack-query/recommended",

			plugins: {
				"tanstack-query": eslintPluginTanstackQuery,
			},

			rules: renameRules(
				eslintPluginTanstackQuery.configs["flat/recommended"][0]?.rules,
				defaultPluginRenameMap
			),
		});
	}

	return defineConfig([
		config,

		createOverrideRules({
			configName: "tanstack",
			overrides,
		}),
	]);
};

export { tanstack };
