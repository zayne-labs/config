import fsp from "node:fs/promises";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { zayne } from "@/factory";

// eslint-disable-next-line ts-eslint/no-deprecated -- Allow this, cuz built in rules are always marked deprecated
const coreRules = () => ({ plugins: { "": { rules: Object.fromEntries(builtinRules) } } });

const configs = await zayne({
	astro: true,
	comments: true,
	depend: true,
	expo: true,
	imports: true,
	jsdoc: true,
	jsonc: true,
	jsx: { a11y: true },
	markdown: true,
	node: { security: true },
	perfectionist: true,
	pnpm: { catalogs: true, json: true, sort: true, yaml: true },
	react: { compiler: true, nextjs: true, refresh: true, youMightNotNeedAnEffect: true },
	solid: true,
	stylistic: true,
	tailwindcssBetter: true,
	tanstack: { query: true, router: true },
	toml: true,
	typescript: { erasableOnly: true },
	unicorn: true,
	vue: true,
	yaml: true,
}).prepend(coreRules());

const dts = await flatConfigsToRulesDTS(configs as Parameters<typeof flatConfigsToRulesDTS>[0], {
	exportTypeName: "Rules",
	includeAugmentation: false,
});

const configNames = configs.map((config) => config.name).filter(Boolean);

const extraDts = `

// Names of all the configs
export type ConfigNames = ${configNames.map((configName) => `"${configName}"`).join(" | ")}
`;

await fsp.writeFile("src/typegen.d.ts", `${dts}${extraDts}`);
