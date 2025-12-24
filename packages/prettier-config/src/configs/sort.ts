import { getDefaultImportSortingOrder } from "@/constants/defaults";
import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages } from "@/utils";

export const sortImports = async (
	options: ExtractOptions<OptionsPrettierConfig["sortImports"]>
): Promise<typeof options> => {
	const necessaryPlugins = ["@ianvs/prettier-plugin-sort-imports"];

	await ensurePackages(necessaryPlugins);

	const sortingOrder = getDefaultImportSortingOrder();

	return {
		...options,

		importOrder: [...sortingOrder.main, ...(options.importOrder ?? []), sortingOrder.css],
		importOrderSafeSideEffects: [sortingOrder.css, ...(options.importOrderSafeSideEffects ?? [])],

		plugins: [...necessaryPlugins, ...(options.plugins ?? [])],
	};
};
