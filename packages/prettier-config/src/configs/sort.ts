import type { Parser, Printer } from "prettier";
import { getDefaultImportSortingOrder } from "@/constants/defaults";
import type { ExtractOptions, OptionsPrettierConfig } from "@/types";
import { ensurePackages, interopDefault, isPackageInScope } from "@/utils";

export const sortImports = async (
	options: ExtractOptions<OptionsPrettierConfig["sortImports"]>
): Promise<typeof options> => {
	await ensurePackages(["@ianvs/prettier-plugin-sort-imports"]);

	const prettierSortImportsPlugin = (await interopDefault(
		import("@ianvs/prettier-plugin-sort-imports")
	)) as {
		parsers: Record<string, Parser>;
		printers: Record<string, Printer>;
	};

	if (!isPackageInScope("prettier-plugin-ember-template-tag")) {
		delete prettierSortImportsPlugin.parsers["ember-template-tag"];
	}

	if (!isPackageInScope("@prettier/plugin-oxc")) {
		delete prettierSortImportsPlugin.parsers.oxc;
		delete prettierSortImportsPlugin.parsers["oxc-ts"];
		delete prettierSortImportsPlugin.printers["estree-oxc"];
	}

	const sortingOrder = getDefaultImportSortingOrder();

	return {
		...options,

		importOrder: [...sortingOrder.main, ...(options.importOrder ?? []), sortingOrder.css],
		importOrderSafeSideEffects: [sortingOrder.css, ...(options.importOrderSafeSideEffects ?? [])],
		importOrderTypeScriptVersion: "5.9.3",

		plugins: [prettierSortImportsPlugin, ...(options.plugins ?? [])],
	};
};
