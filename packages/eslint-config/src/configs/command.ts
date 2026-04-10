import { interopDefault } from "@/utils";
import type { TypedFlatConfigItem } from "../types";

export const command = async (): Promise<TypedFlatConfigItem[]> => {
	const createCommand = await interopDefault(import("eslint-plugin-command/config"));

	return [
		{
			...createCommand(),
			name: "zayne/command/rules",
		},
	];
};
