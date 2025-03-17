# @zayne-labs/eslint-config

- Reasonable defaults, best practices, only one line of config
- Designed to work with TypeScript, JSX, Vue, JSON, YAML, Toml, Markdown, etc. Out-of-box.
- Opinionated, but [very customizable](#customization)
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new), compose easily!
- Optional [React](#react), [Svelte](#svelte), [TailwindCSS](#tailwindcss), [Astro](#astro), [Solid](#solid) support
- Respects `.gitignore` by default
- Requires ESLint v9.5.0+
- Inspired by the legendary open sourcerer, [antfu](https://github.com/antfu/eslint-config)

## Usage

Hey there! 👋 Let's get you started with this ESLint config. Here's how to set it up:

### Installation

Just run one of these commands in your project:

```bash
pnpm add -D eslint @zayne-labs/eslint-config

# Using npm
npm install -D eslint @zayne-labs/eslint-config

# Using yarn
yarn add -D eslint @zayne-labs/eslint-config
```

Then create an `eslint.config.js` in your project root:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne()
```

That's it! You're ready to go. Want to do more? Check out the customization options below.

<details>
<summary>Combined with legacy config:</summary>

If you still use some configs from the legacy eslintrc format, you can use the [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) package to convert them to the flat config.

```js
// eslint.config.mjs
import { zayne } from '@zayne-labs/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()

export default zayne(
  {
    ignores: [],
  },

  // Legacy config
  [
    ...compat.config({
      extends: [
        'eslint:recommended',
        // Other extends...
      ],
    }),

    // Other flat configs...
  ]
)
```

> Note that `.eslintignore` no longer works in Flat config, see [customization](#customization) for more details.

</details>

### Add script for package.json

Add these handy scripts to your `package.json`:

```json
{
  "scripts": {
    "lint:eslint": "eslint .",
    "lint:eslint-fix": "eslint . --fix"
  }
}
```

## IDE Support (auto fix on save)

Let's set up your editor to automatically fix ESLint issues when you save. Here's how:

<details>
<summary>🟦 VS Code support</summary>

<br>

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

Add the following settings to your `.vscode/settings.json`:

```jsonc
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
<summary>🟩 Neovim Support</summary>

<br>

Update your configuration to use the following:

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

### Neovim format on save

There's few ways you can achieve format on save in neovim:

- `nvim-lspconfig` has a `EslintFixAll` command predefined, you can create a autocmd to call this command after saving file.

```lua
lspconfig.eslint.setup({
  --- ...
  on_attach = function(client, bufnr)
    vim.api.nvim_create_autocmd("BufWritePre", {
      buffer = bufnr,
      command = "EslintFixAll",
    })
  end,
})
```

- Use [conform.nvim](https://github.com/stevearc/conform.nvim)
- Use [none-ls](https://github.com/nvimtools/none-ls.nvim)
- Use [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

The great thing about this config is that it works out of the box with zero config. But if you want to tweak things (and who doesn't?), here's how:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  // Enable stylistic formatting rules
  stylistic: true,

  // TypeScript and React are auto-detected, but you can be explicit:
  typescript: true,
  react: true,

  // Don't need JSON or YAML? Turn them off:
  jsonc: false,
  yaml: false,

  // Since `.eslintignore` isn't supported in Flat config, use `ignores`:
  ignores: [
    'build/**',
    // ...globs
  ]
})
```

Need more control? The `zayne` function takes a second argument for custom overrides:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne(
  {
    // Your base config
  },

  // Custom ESLint configs
  [
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      rules: {
        'no-console': 'warn',
      },
    },
  ],
)
```

Going more advanced, you can also import fine-grained configs and compose them as you wish:

<details>
<summary>Advanced Example</summary>

We wouldn't recommend using this style in general unless you know exactly what they are doing, as there are shared options between configs and might need extra care to make them consistent.

```js
// eslint.config.js
import {
  combine,
  comments,
  ignores,
  imports,
  javascript,
  jsdoc,
  jsonc,
  markdown,
  node,
  sortPackageJson,
  sortTsconfig,
  stylistic,
  toml,
  typescript,
  unicorn,
  vue,
  yaml,
} from '@zayne-labs/eslint-config'

export default combine(
  ignores(),
  javascript(/* Options */),
  comments(),
  node(),
  jsdoc(),
  imports(),
  unicorn(),
  typescript(/* Options */),
  stylistic(),
  vue(),
  jsonc(),
  yaml(),
  toml(),
  markdown(),
)
```

</details>

Check out the [configs](https://github.com/zayne-labs/eslint-config/blob/main/src/configs) and [factory](https://github.com/zayne-labs/eslint-config/blob/main/src/factory.ts) for more details.

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and reference.

### Framework Support

Need to lint your favorite framework? We've got you covered! Here's how to enable support for various frameworks:

#### React

React support is usually auto-detected, but you can explicitly enable it:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  react: true,
})
```

When you run `pnpm eslint`, it'll let you know if you need to install any dependencies. But if you prefer to install them manually:

```bash
pnpm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Svelte

To enable svelte support, you need to explicitly turn it on:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  svelte: true,
})
```

Running `pnpm eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D eslint-plugin-svelte
```

#### Astro

To enable astro support, you need to explicitly turn it on:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  astro: true,
})
```

Running `pnpm eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D eslint-plugin-astro
```

#### Solid

To enable Solid support, you need to explicitly turn it on:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  solid: true,
})
```

Running `pnpm eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D eslint-plugin-solid
```

#### TailwindCSS

To enable Tailwindcss support, you need to explicitly turn it on:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  tailwindcss: true,
})
```

Running `pnpm eslint` should prompt you to install the required dependencies, otherwise, you can install them manually:

```bash
pnpm i -D eslint-plugin-tailwindcss
```

### Type Aware Rules

Working with TypeScript? You can enable type-aware linting by pointing to your `tsconfig.json`:

```js
// eslint.config.js
import { zayne } from '@zayne-labs/eslint-config'

export default zayne({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
})
```

## View what rules are enabled

Want to see what rules are active in your project? There's a cool tool for that! Use the ESLint config inspector (created by [Anthony Fu](https://github.com/antfu)):

```bash
pnpx @eslint/config-inspector@latest
```

## Versioning Policy

We follow [Semantic Versioning](https://semver.org/), but with a twist since this is a config package. Here's what we consider breaking changes and what we don't:

### Breaking Changes ⚠️

- Node.js version changes
- Major refactors that could break your setup
- Big plugin updates that change behavior
- Changes affecting most codebases

### Non-Breaking Changes 🌟

- Enabling/disabling rules (even if they get stricter)
- Tweaking rule options
- Updating dependencies

## FAQ

### "I prefer X instead of Y..."

No worries! This config is just our take on things. Feel free to override rules locally to match your style. If that's not enough, you can always fork the repo and make it your own.

## 🤝 Contributing

We welcome contributions! Please check out our [contribution guidelines](https://github.com/zayne-labs/contribute) for details on how to get started.

## 📄 License

MIT © [Ryan Zayne]

## 💖 Credits

Inspired by the legendary open sourcerer, [antfu](https://github.com/antfu/eslint-config)
