# `@zayne-labs/tsconfig`

This package helps set proper tsconfig presets for most projects. Inspired by Matt Pocock's [TSConfig Cheat Sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet).

## Setup

1. Install:

```bash
# Npm
npm install --save-dev @zayne-labs/tsconfig

# Pnpm
pnpm add -D @zayne-labs/tsconfig
```

2. Choose which `tsconfig.json` you need from the [list](#list-of-tsconfigs) below.

3. Add it to your `tsconfig.json`:

```jsonc
{
 // For building an app that runs in the DOM with an external bundler
 "extends": "@zayne-labs/tsconfig/bundler/dom/app"
}
```

## List of TSConfigs

### Are You Using `tsc` To Turn Your `.ts` Files Into `.js` Files?

#### Yes

If yes, use this selection of configs:

```jsonc
{
 // For code that runs in the DOM:
 "extends": "@zayne-labs/tsconfig/tsc/dom/app", // For an app
 "extends": "@zayne-labs/tsconfig/tsc/dom/library", // For a library
 "extends": "@zayne-labs/tsconfig/tsc/dom/library-monorepo", // For a library in a monorepo

 // For code that doesn't run in the DOM (for instance, in Node.js):
 "extends": "@zayne-labs/tsconfig/tsc/no-dom/app", // For an app
 "extends": "@zayne-labs/tsconfig/tsc/no-dom/library", // For a library
 "extends": "@zayne-labs/tsconfig/tsc/no-dom/library-monorepo" // For a library in a monorepo
}
```

#### No

If no, you're probably using an external bundler.

```jsonc
{
 // For code that runs in the DOM:
 "extends": "@zayne-labs/tsconfig/bundler/dom/app", // For an app
 "extends": "@zayne-labs/tsconfig/bundler/dom/library", // For a library
 "extends": "@zayne-labs/tsconfig/bundler/dom/library-monorepo", // For a library in a monorepo

 // For code that doesn't run in the DOM (for instance, in Node.js):
 "extends": "@zayne-labs/tsconfig/bundler/no-dom/app", // For an app
 "extends": "@zayne-labs/tsconfig/bundler/no-dom/library", // For a library
 "extends": "@zayne-labs/tsconfig/bundler/no-dom/library-monorepo" // For a library in a monorepo
}
```

### Framework-Specific Options

The following are currently supported framework-specific options, will add more if needed in future:

```jsonc
{
 // For a nextjs app
 "extends": "@zayne-labs/tsconfig/bundler/dom/next"
}
```
