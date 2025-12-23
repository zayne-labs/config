import { isFunction } from "@zayne-labs/toolkit-type-helpers";
import { globalIgnores } from "eslint/config";
import { GLOB_EXCLUDE } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

export const ignores = (userIgnores: OptionsConfig["ignores"] = []): TypedFlatConfigItem[] => {
	const initIgnores = [...GLOB_EXCLUDE];

	const resolvedUserIgnores = isFunction(userIgnores) ? userIgnores(initIgnores) : userIgnores;

	return [globalIgnores([...initIgnores, ...resolvedUserIgnores], "zayne/defaults/ignores")];
};

export const gitIgnores = async (
	options?: ExtractOptions<OptionsConfig["gitignore"]>
): Promise<TypedFlatConfigItem[]> => {
	const antfuGitIgnore = await interopDefault(import("eslint-config-flat-gitignore"));

	const config = antfuGitIgnore({
		name: "zayne/gitignore/setup",
		strict: false,
		...options,
	});

	return [config];
};
