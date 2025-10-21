import fs from "node:fs/promises";
import { builtinRules } from "eslint/use-at-your-own-risk";
import { flatConfigsToRulesDTS } from "eslint-typegen/core";
import {
	astro,
	comments,
	depend,
	expo,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
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
} from "../src/configs";
import { combine } from "../src/utils";

const coreRules = () => ({
	// eslint-disable-next-line ts-eslint/no-deprecated -- Allow this, cuz built in rules are always marked deprecated
	plugins: { "": { rules: Object.fromEntries(builtinRules) } },
});

const configs = await combine(
	coreRules(),
	javascript(),
	unicorn(),
	typescript({ erasableOnly: true }),
	perfectionist(),
	stylistic(),
	imports(),
	jsdoc(),
	jsonc(),
	react({ nextjs: true }),
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
	expo(),
	jsx({ a11y: true }),
	markdown()
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
