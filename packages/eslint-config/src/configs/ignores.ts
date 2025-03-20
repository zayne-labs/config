import { interopDefault } from "@/utils";
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore";
import { globalIgnores } from "eslint/config";
import { GLOB_EXCLUDE } from "../globs";
import type { TypedFlatConfigItem } from "../types";

export const ignores = (userIgnores: string[] = []): TypedFlatConfigItem[] => {
	return [globalIgnores([...GLOB_EXCLUDE, ...userIgnores], "zayne/defaults/ignores")];
};

export const gitIgnores = async (options?: FlatGitignoreOptions): Promise<TypedFlatConfigItem[]> => {
	const antfuGitIgnore = await interopDefault(import("eslint-config-flat-gitignore"));

	const config = antfuGitIgnore({
		name: "zayne/gitignore",
		strict: false,
		...options,
	});

	return [config];
};
