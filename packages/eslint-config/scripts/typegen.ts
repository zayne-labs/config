import fsPromises from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { CONFIG_PRESET_FULL_ON } from "@/config-presets";
import { zayne } from "@/factory";

const coreRules = () => ({
	plugins: {
		"": {
			// eslint-disable-next-line ts-eslint/no-deprecated -- Allow this, cuz built in rules are always marked deprecated
			rules: Object.fromEntries(builtinRules),
		},
	},
});

const configs = await zayne(CONFIG_PRESET_FULL_ON).prepend(coreRules());

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
});

const configNames = configs.map((config) => config.name).filter(Boolean);

dts += `

// Names of all the configs
export type ConfigNames = ${configNames.map((configName) => `"${configName}"`).join(" | ")}
`;

await fsPromises.writeFile("src/typegen.d.ts", dts);
