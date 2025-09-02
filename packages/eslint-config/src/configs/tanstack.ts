import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault, isObject, renameRules } from "@/utils";
import { defaultPluginRenameMap } from "../constants";

const tanstack = async (
	options: ExtractOptions<OptionsConfig["tanstack"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, query = true, router } = options;

	const config: TypedFlatConfigItem[] = [];

	await ensurePackages([
		query ? "@tanstack/eslint-plugin-query" : undefined,
		router ? "@tanstack/eslint-plugin-router" : undefined,
	]);

	const [eslintPluginTanstackQuery, eslintPluginTanstackRouter] = await Promise.all([
		query ? interopDefault(import("@tanstack/eslint-plugin-query")) : undefined,
		router ? interopDefault(import("@tanstack/eslint-plugin-router")) : undefined,
	]);

	if (query && eslintPluginTanstackQuery) {
		config.push(
			{
				name: "zayne/tanstack-query/recommended",

				plugins: {
					"tanstack-query": eslintPluginTanstackQuery,
				},

				rules: renameRules(
					eslintPluginTanstackQuery.configs["flat/recommended"][0]?.rules,
					defaultPluginRenameMap
				),
			},

			{
				name: "zayne/tanstack-query/rules",

				rules: {
					...overrides,
					...(isObject(query) && query.overrides),
				},
			}
		);
	}

	if (router && eslintPluginTanstackRouter) {
		config.push(
			{
				name: "zayne/tanstack-router/recommended",

				plugins: {
					"tanstack-router": eslintPluginTanstackRouter,
				},

				rules: renameRules(
					eslintPluginTanstackRouter.configs["flat/recommended"][0]?.rules,
					defaultPluginRenameMap
				),
			},

			{
				name: "zayne/tanstack-router/rules",

				rules: {
					...overrides,
					...(isObject(router) && router.overrides),
				},
			}
		);
	}

	return config;
};

export { tanstack };
