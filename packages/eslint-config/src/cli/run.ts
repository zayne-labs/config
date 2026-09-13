/* eslint-disable perfectionist/sort-objects  -- Ignore */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import c from "ansis";
import { extra, extraOptions, frameworkOptions, frameworks } from "./constants";
import { updateEslintFiles } from "./stages/update-eslint-files";
import { updatePackageJson } from "./stages/update-package-json";
import { updateVscodeSettings } from "./stages/update-vscode-settings";
import type { ExtraLibrariesOptionUnion, FrameworkOptionUnion, PromptResult } from "./types";
import { isGitClean } from "./utils";

const ESLINT_CONFIG_FILES = [
	"eslint.config.js",
	"eslint.config.mjs",
	"eslint.config.cjs",
	"eslint.config.ts",
	"eslint.config.mts",
	"eslint.config.cts",
];

export type CliRunOptions = {
	/**
	 * Use the extra utils: tailwindcss-better
	 */
	extra?: string[];
	/**
	 * Use the framework template for optimal customization: vue / react / solid / astro
	 */
	frameworks?: string[];
	/**
	 * Skip prompts and use default values
	 */
	yes?: boolean;
};

export const runCli = async (options: CliRunOptions = {}): Promise<void> => {
	const isSkippingPrompts = Boolean(process.env.SKIP_PROMPT) || Boolean(options.yes);

	const argTemplate = options.frameworks
		?.filter((framework) => typeof framework === "string")
		.map((framework) => framework.trim())
		.filter(Boolean);

	const argExtra = options.extra
		?.filter((extraOption) => typeof extraOption === "string")
		.map((extraOption) => extraOption.trim())
		.filter(Boolean);

	const invalidFrameworks = argTemplate?.filter((framework) => !frameworks.includes(framework));

	const invalidExtras = argExtra?.filter((extraOption) => !extra.includes(extraOption));

	if (isSkippingPrompts && ((invalidFrameworks?.length ?? 0) > 0 || (invalidExtras?.length ?? 0) > 0)) {
		throw new Error(
			`Invalid CLI options.${
				invalidFrameworks?.length ? ` Frameworks: ${invalidFrameworks.join(", ")}.` : ""
			}${invalidExtras?.length ? ` Extras: ${invalidExtras.join(", ")}.` : ""}`
		);
	}

	const existingConfigFile = ESLINT_CONFIG_FILES.find((fileName) =>
		fs.existsSync(path.join(process.cwd(), fileName))
	);

	if (existingConfigFile) {
		p.log.warn(c.yellow`${existingConfigFile} already exists, migration wizard exited.`);

		return process.exit(1);
	}

	// Set default value for promptResult if `isSkippingPrompts` is enabled
	let result: PromptResult = {
		extra: (argExtra ?? []) as ExtraLibrariesOptionUnion[],
		frameworks: (argTemplate ?? []) as FrameworkOptionUnion[],
		uncommittedConfirmed: false,
		updateVscodeSettings: true,
	};

	if (!isSkippingPrompts) {
		result = (await p.group(
			{
				uncommittedConfirmed: () => {
					if (isGitClean()) {
						return Promise.resolve(true);
					}

					return p.confirm({
						initialValue: false,
						message:
							"There are uncommitted changes in the current repository, are you sure to continue?",
					});
				},

				frameworks: ({ results }) => {
					const isArgTemplateValid =
						(argTemplate?.length ?? 0) > 0
						&& (argTemplate ?? []).filter((element) => !frameworks.includes(element)).length === 0;

					if (isArgTemplateValid || !results.uncommittedConfirmed) return;

					const message =
						argTemplate ?
							`"${JSON.stringify(argTemplate)}" isn't a valid template. Please choose from below: `
						:	"Select a framework:";

					return p.multiselect<FrameworkOptionUnion>({
						message: c.reset(message),
						options: frameworkOptions,
						required: false,
					});
				},

				extra: ({ results }) => {
					const isArgExtraValid =
						(argExtra?.length ?? 0) > 0
						&& (argExtra ?? []).filter((element) => !extra.includes(element)).length === 0;

					if (isArgExtraValid || !results.uncommittedConfirmed) return;

					const message =
						argExtra ?
							`"${JSON.stringify(argExtra)}" isn't a valid extra util. Please choose from below: `
						:	"Select an extra util:";

					return p.multiselect<ExtraLibrariesOptionUnion>({
						message: c.reset(message),
						options: extraOptions,
						required: false,
					});
				},

				updateVscodeSettings: ({ results }) => {
					if (!results.uncommittedConfirmed) return;

					return p.confirm({
						initialValue: true,
						message: "Update .vscode/settings.json for better VS Code experience?",
					});
				},
			},
			{
				onCancel: () => {
					p.cancel("Operation cancelled.");
					process.exit(0);
				},
			}
		)) as PromptResult;

		if (!result.uncommittedConfirmed) {
			return process.exit(1);
		}
	}

	await updatePackageJson(result);
	await updateEslintFiles(result);
	await updateVscodeSettings(result);

	p.log.success(c.green`Setup completed`);

	p.outro(
		`Now you can update the dependencies by running ${c.blue("pnpm install")} and also ${c.blue("eslint --fix")}\n`
	);
};
