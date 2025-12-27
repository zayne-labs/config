/* eslint-disable ts-eslint/restrict-template-expressions -- Ignore */
import { execSync } from "node:child_process";

export const isGitClean = (): boolean => {
	try {
		execSync("git diff-index --quiet HEAD --");
		return true;
	} catch {
		return false;
	}
};

export const getEslintConfigContent = (mainConfig: string, additionalConfigs?: string[]): string => {
	const additionalConfigsStr = additionalConfigs?.map((config) => `,{\n${config}\n}`);

	return `
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
${mainConfig}
}${additionalConfigsStr})
`.trimStart();
};
