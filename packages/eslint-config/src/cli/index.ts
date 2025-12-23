import process from "node:process";
import * as p from "@clack/prompts";
import c from "ansis";
import { cac } from "cac";
import { version } from "../../package.json";
import { runCli, type CliRunOptions } from "./run";

const header = () => {
	p.intro(`${c.green`@zayne-labs/eslint-config `}${c.dim`v${version}`}`);
};

const cli = cac("@zayne-labs/eslint-config");

cli.command("", "Run the initialization or migration")
	.option("--yes, -y", "Skip prompts and use default values", { default: false })
	.option(
		"--template, -t <template>",
		"Use the framework template for optimal customization: vue / react / svelte / astro",
		{ type: [] }
	)
	.option("--extra, -e <extra>", "Use the extra utils: tailwindcss", { type: [] })
	.action(async (options: CliRunOptions) => {
		header();
		try {
			await runCli(options);
		} catch (error) {
			p.log.error(c.inverse.red(" Failed to migrate "));
			p.log.error(c.red`✘ ${String(error)}`);
			process.exit(1);
		}
	});

cli.help();
cli.version(version);
cli.parse();
