import fs from "node:fs/promises";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import {
	astro,
	combine,
	comments,
	depend,
	expo,
	imports,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	pnpm,
	react,
	solid,
	stylistic,
	tailwindcssBetter,
	tanstack,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from "../src";

const coreRules = () => ({
	// eslint-disable-next-line ts-eslint/no-deprecated -- Allow this, cuz built in rules are always marked deprecated
	plugins: { "": { rules: Object.fromEntries(builtinRules) } },
});

const configs = await combine(
	coreRules(),
	javascript(),
	unicorn(),
	typescript(),
	perfectionist(),
	stylistic(),
	imports(),
	jsdoc(),
	jsonc(),
	react({ compiler: true, nextjs: true }),
	node({ security: true }),
	tanstack({ query: true, router: true }),
	comments(),
	toml(),
	yaml(),
	vue(),
	solid(),
	pnpm(),
	astro(),
	depend(),
	tailwindcssBetter(),
	expo()
);

const dts = await flatConfigsToRulesDTS(configs, {
	exportTypeName: "Rules",
	includeAugmentation: false,
});

const configNames = configs.map((config) => config.name).filter(Boolean);

const extraDts = `

// Names of all the configs
export type ConfigNames = ${configNames.map((configName) => `"${configName}"`).join(" | ")}
`;

await fs.writeFile("src/typegen.d.ts", `${dts}${extraDts}`);
