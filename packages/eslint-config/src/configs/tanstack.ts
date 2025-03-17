import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, renameRules } from "@/utils";
import { defaultPluginRenameMap } from "../constants";

const tanstack = async (
	options: ExtractOptions<OptionsConfig["tanstack"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { query = true } = options;

	const config: TypedFlatConfigItem[] = [];

	await ensurePackages([...(query ? ["@tanstack/eslint-plugin-query"] : [])]);

	const [eslintPluginTanstackQuery] = await Promise.all(
		query ? [interopDefault(import("@tanstack/eslint-plugin-query"))] : []
	);

	if (query && eslintPluginTanstackQuery) {
		config.push({
			name: "zayne/tanstack/query-recommended",

			plugins: {
				"tanstack-query": eslintPluginTanstackQuery,
			},

			rules: renameRules(
				eslintPluginTanstackQuery.configs["flat/recommended"][0]?.rules,
				defaultPluginRenameMap
			),
		});
	}

	return config;
};

export { tanstack };
