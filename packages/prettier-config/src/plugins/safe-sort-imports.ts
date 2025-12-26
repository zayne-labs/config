import type { Parser, Printer } from "prettier";
import { interopDefault, isPackageInScope } from "@/utils";

/**
 * @description This is a temporary fix until the plugin is updated to only load the parsers for the plugins that are in scope.
 * @see https://github.com/ianvs/prettier-plugin-sort-imports/issues/233
 */
const getSafeSortPlugin = async () => {
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

	return prettierSortImportsPlugin;
};

const safeSortPlugin = await getSafeSortPlugin();

export default safeSortPlugin;
