import { getDefaultImportSortingOrder } from "@/constants/defaults";
import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

export const sortImports = async (
	options: ExtractOptions<OptionsPrettierConfig["sortImports"]>
): Promise<typeof options> => {
	await ensurePackages(["@ianvs/prettier-plugin-sort-imports"]);

	const prettierSortImportsPlugin = await interopDefault(import("@ianvs/prettier-plugin-sort-imports"));

	delete (prettierSortImportsPlugin as { parsers: Record<string, unknown> }).parsers[
		"ember-template-tag"
	];

	const sortingOrder = getDefaultImportSortingOrder();

	return {
		...options,

		importOrder: [...sortingOrder.main, ...(options.importOrder ?? []), sortingOrder.css],
		importOrderSafeSideEffects: [sortingOrder.css, ...(options.importOrderSafeSideEffects ?? [])],
		importOrderTypeScriptVersion: "5.9.3",

		plugins: [prettierSortImportsPlugin, ...(options.plugins ?? [])],
	};
};
