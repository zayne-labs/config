# @zayne-labs/eslint-config

Opinionated ESLint config with sensible defaults and zero-config setup.

- One-line setup with reasonable defaults and best practices
- Works out-of-the-box with TypeScript, JSX, Vue, JSON, YAML, TOML, Markdown, and more
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) for easy composition
- Optional framework support: [Vue](#vue), [React](#react), [Svelte](#svelte), [Astro](#astro), [Solid](#solid)
- Respects `.gitignore` by default
- Highly [customizable](#customization) when you need it
- Requires ESLint v9.5.0+ and Node.js v20+
- Interactive CLI for easy setup

Inspired by [antfu/eslint-config](https://github.com/antfu/eslint-config)

## Usage

### Quick Setup (Recommended)

Use the interactive CLI to set up your config:

```bash
pnpx @zayne-labs/eslint-config@latest
```

The CLI will guide you through:

- Framework selection (React, Vue, Svelte, Astro)
- Additional integrations (TailwindCSS, etc.)
- Automatic dependency installation

### Manual Installation

```bash
pnpm add -D eslint @zayne-labs/eslint-config
```

Create `eslint.config.js` in your project root:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne();
```

Done! Check out [customization](#customization) for more options.

<details>
<summary>Combining with legacy config</summary>

If you have existing eslintrc configs, use [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) to convert them:

```js
import { zayne } from "@zayne-labs/eslint-config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

export default zayne(
	{
		ignores: [],
	},
	...compat.config({
		extends: [
			"eslint:recommended",
			// Other extends...
		],
	})
	// Other flat configs...
);
```

Note: `.eslintignore` no longer works in flat config. Use the `ignores` option instead (see [customization](#customization)).

</details>

### Package Scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"lint:eslint": "eslint .",
		"lint:eslint-fix": "eslint . --fix"
	}
}
```

## IDE Support

Configure your editor to auto-fix ESLint issues on save:

<details>
<summary>VS Code</summary>

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add to `.vscode/settings.json`:

```json
{
	// Auto fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},

	// Enable eslint for all supported languages
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"vue",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml",
		"xml",
		"gql",
		"graphql",
		"astro",
		"svelte",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss"
	]
}
```

</details>

<details>
<summary>Neovim</summary>

Update your configuration:

```lua
local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "svelte",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
  }
)
```

**Format on save options:**

- Use the built-in `EslintFixAll` command with an autocmd:

   ```lua
   lspconfig.eslint.setup({
     on_attach = function(client, bufnr)
       vim.api.nvim_create_autocmd("BufWritePre", {
         buffer = bufnr,
         command = "EslintFixAll",
       })
     end,
   })
   ```

- Or use [conform.nvim](https://github.com/stevearc/conform.nvim), [none-ls](https://github.com/nvimtools/none-ls.nvim), or [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

This config works out of the box with zero configuration. Customize it when needed:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	// `.eslintignore` is no longer supported in Flat config, use `ignores` instead
	// The `ignores` option in the option (first argument) is specifically treated to always be global ignores
	// And will **extend** the config's default ignores, not override them
	// You can also pass a function to modify the default ignores
	ignores: [
		"**/fixtures",
		// ...globs
	],

	// Parse the `.gitignore` file to get the ignores, on by default
	gitignore: true,

	// Project type: 'app' (default) or 'lib'
	type: "app",

	// Disable all optional configs at once (keeps only essentials)
	withDefaults: false,

	// Enable stylistic formatting rules
	stylistic: true,

	// Or customize the stylistic rules
	stylistic: {
		jsx: true,
		quotes: "single", // or 'double'
	},

	// TypeScript and React are auto-detected, but can be explicit
	typescript: true,
	react: true,

	// Disable specific language support
	jsonc: false,
	yaml: false,
});
```

### Custom Rules

Pass additional configs as extra arguments:

```ts
import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		// Configures for zayne's config
	},

	// From the second arguments they are ESLint Flat Configs
	// you can have multiple configs
	{
		files: ["**/*.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
	{
		rules: {
			"no-console": "warn",
		},
	}
);
```

### Advanced Composition

Import and compose fine-grained configs directly:

<details>
<summary>Show example</summary>

**Note**: This low-level approach is for advanced use cases only. The `zayne()` factory handles option coordination automatically, so use this only if you need granular control over config composition. Not necessarily recommended

```js
import {
	astro,
	comments,
	depend,
	expo,
	ignores,
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
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcssBetter,
	tanstack,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from "@zayne-labs/eslint-config";
import { FlatConfigComposer } from "eslint-flat-config-utils";

export default new FlatConfigComposer().append(
	ignores(),
	javascript(),
	typescript(),
	jsx(),
	comments(),
	node(),
	jsdoc(),
	imports(),
	unicorn(),
	perfectionist(),
	stylistic(),
	react(),
	vue(),
	jsonc(),
	yaml(),
	toml(),
	markdown()
);
```

</details>

See [configs](https://github.com/zayne-labs/eslint-config/blob/main/src/configs) and [factory](https://github.com/zayne-labs/eslint-config/blob/main/src/factory.ts) for implementation details.

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and reference.

## Framework & Integration Support

Enable framework-specific linting rules and integrations:

### Vue

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	vue: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-vue vue-eslint-parser
```

### React

Auto-detected in most cases, or enable explicitly:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	react: true,
});
```

Install peer dependencies (prompted automatically when running ESLint):

```bash
pnpm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

### Svelte

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	svelte: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-svelte
```

### Astro

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	astro: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-astro
```

### Solid

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	solid: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-solid
```

### TailwindCSS

Uses the enhanced `eslint-plugin-better-tailwindcss` for improved class sorting and validation:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	tailwindcssBetter: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-better-tailwindcss
```

### Expo (React Native)

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	expo: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-config-expo
```

### TanStack

Support for TanStack Query and Router:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	tanstack: {
		query: true,
		router: true,
	},
});
```

Install peer dependencies:

```bash
pnpm i -D @tanstack/eslint-plugin-query @tanstack/eslint-plugin-router
```

### PNPM Catalogs

Lint PNPM catalog protocol usage:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	pnpm: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-pnpm
```

### Dependency Management

Enforce dependency rules with `eslint-plugin-depend`:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	depend: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-depend
```

## Type-Aware Rules

Type-aware linting is automatically enabled when TypeScript is detected. It uses the nearest `tsconfig.json` by default.

Only specify `tsconfigPath` when you need to:

- Point to a tsconfig in a different location
- Use multiple tsconfigs

Single custom tsconfig location:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	typescript: {
		tsconfigPath: "./config/tsconfig.json",
	},
});
```

Multiple tsconfigs:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	typescript: {
		tsconfigPath: ["./tsconfig.json", "./tsconfig.node.json"],
	},
});
```

## Inspecting Config

View active rules using the [ESLint Config Inspector](https://github.com/eslint/config-inspector):

```bash
npx @eslint/config-inspector@latest
```

## Versioning

Follows [Semantic Versioning](https://semver.org/) with config-specific considerations:

**Breaking changes:**

- Node.js version requirements
- Major refactors affecting setup
- Plugin updates with significant behavior changes
- Changes affecting most codebases

**Non-breaking changes:**

- Rule additions, removals, or option changes
- Dependency updates
- Stricter linting (considered improvements)

## FAQ

### I prefer different rules

Override any rules locally using the [customization](#customization) options. For extensive changes, consider forking the repo.

## Contributing

Contributions welcome! See our [contribution guidelines](https://github.com/zayne-labs/contribute) for details.

## License

MIT © Ryan Zayne

## Credits

Inspired by [antfu/eslint-config](https://github.com/antfu/eslint-config)
