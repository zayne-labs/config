# @zayne-labs/config

Shared configs for ESLint, Prettier, and TypeScript. Used across all Zayne Labs' projects.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg)](https://pnpm.io/)

## Why

I got tired of copying the same config files across projects. This repo contains our standard configs that we use everywhere.

## What's included

| Package | What it does | Official Docs |
|---------|-------------|---------------|
| [@zayne-labs/eslint-config](./packages/eslint-config) | ESLint config setup for all kinds of projects | [ESLint Docs](https://eslint.org/docs/latest/) |
| [@zayne-labs/prettier-config](./packages/prettier-config) | Prettier code formatting configs with Tailwind support | [Prettier Docs](https://prettier.io/docs/en/) |
| [@zayne-labs/tsconfig](./packages/tsconfig) | TypeScript configs for all kinds of projects | [TypeScript Docs](https://www.typescriptlang.org/docs/) |

## Getting started

Install what you need:

```bash
# ESLint
pnpm add -D @zayne-labs/eslint-config

# Prettier
pnpm add -D @zayne-labs/prettier-config

# TypeScript
pnpm add -D @zayne-labs/tsconfig
```

Check each package's README for setup instructions.

## License

MIT © [Zayne Labs](https://github.com/zayne-labs)
