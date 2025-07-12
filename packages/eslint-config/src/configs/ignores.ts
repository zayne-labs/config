import { globalIgnores } from "eslint/config";
import { interopDefault } from "@/utils";
import { GLOB_EXCLUDE } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";

export const ignores = (userIgnores: string[] = []): TypedFlatConfigItem[] => {
	return [globalIgnores([...GLOB_EXCLUDE, ...userIgnores], "zayne/defaults/ignores")];
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
