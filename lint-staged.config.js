/** @type {import('lint-staged').Configuration} */
export default {
	"*.{js,ts,jsx,tsx,json}": () => "pnpm lint:eslint",
	"*.{ts,tsx}": () => "pnpm lint:type-check",
	"package.json": () => ["pnpm lint:publint"],
};
