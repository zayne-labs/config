# @zayne-labs/config

Shared configs for ESLint, Prettier, TypeScript, and Knip. Used across all Zayne Labs' projects.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

## Why

I got tired of copying the same config files across projects. This repo contains our standard configs that we use everywhere.

## What's included

| Config Docs                                                         | What it does                                           | Official Docs                                           |
| ------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- |
| [@zayne-labs/eslint-config](./packages/eslint-config/README.md)     | ESLint config setup for all kinds of projects          | [ESLint Docs](https://eslint.org/docs/latest/)          |
| [@zayne-labs/prettier-config](./packages/prettier-config/README.md) | Prettier code formatting configs with Tailwind support | [Prettier Docs](https://prettier.io/docs/en/)           |
| [@zayne-labs/tsconfig](./packages/tsconfig/README.md)               | TypeScript configs for all kinds of projects           | [TypeScript Docs](https://www.typescriptlang.org/docs/) |
| [@zayne-labs/knip-config](./packages/knip-config/README.md)         | Knip config for finding unused files, deps and exports | [Knip Docs](https://knip.dev)                           |

## Getting started

Install what you need:

```bash
# ESLint
pnpm add -D @zayne-labs/eslint-config

# Prettier
pnpm add -D @zayne-labs/prettier-config

# TypeScript
pnpm add -D @zayne-labs/tsconfig

# Knip
pnpm add -D knip @zayne-labs/knip-config
```

Check each package's README for setup instructions.

## License

MIT © [Zayne Labs](https://github.com/zayne-labs)
