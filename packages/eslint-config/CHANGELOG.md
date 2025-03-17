# @zayne-labs/eslint-config

## 0.6.2

### Patch Changes

- 6e2703c: add extra options to prettier config

## 0.6.0

### Minor Changes

- a7f94e5: feat(prettier): add Prettier configuration and integrate with existing setup

## 0.5.1

### Patch Changes

- 8f457a8: feat(factory)!: ✨ add withDefaults option to control default configs
  feat(factory): 📝 improve factory function docs and type organization
  refactor(yaml): 🔄 rename config namespaces from antfu to zayne
  fix(yaml): 🔧 remove redundant style/spaced-comment rule
- 4564cab: fix(react): 🔧 ♻️ refactor react-refresh plugin configuration

   Move react-refresh plugin and its rules into a separate config object that's conditionally added. This improves code organization and prevents potential issues when the refresh option is disabled.

## 0.5.0

### Minor Changes

- 2555a38: feat(solid)✨: add solid.js support with config and typegen integration

   chore(deps)⬆️: update dependencies and lockfile
   docs(readme)📝: improve documentation with better formatting and examples
   ci(workflows)🔧: update GitHub Actions workflow configurations
   refactor(config)♻️: cleanup and improve code organization in config files

## 0.4.3

### Patch Changes

- f4b3394: feat(configs)!: ✨ add react compiler plugin, ♻️ refactor config options

   ✨ Add support for react compiler plugin with new compiler option
   ♻️ Refactor config options to use ExtractOptions type
   🔧 Update Vue config with improved SFC block handling
   🐛 Fix type-aware file extensions for components
   🎨 Improve code organization in react and vue configs
   📝 Update rule configurations and naming

## 0.4.2

### Patch Changes

- 91dd156: fix(config): 🔧 update comments config type handling

   - 🔄 Pass type option from root config to comments config
   - ⚙️ Change default comments type from "app-strict" to "app"

## 0.4.1

### Patch Changes

- a02c293: fix: forgot to remove the require desc rule from comments

## 0.4.0

### Minor Changes

- 02877ea: feat(core)!: ✨ 🔧 add vue, toml, yaml & comments support

   BREAKING CHANGES:

   - ⚠️ Requires ESLint v9.17.0 or higher
   - 🔄 Refactored factory.ts to support new plugins
   - ♻️ Reorganized types into separate interfaces.ts

   Features:

   - ✨ Added Vue support with SFC blocks processor
   - ✨ Added TOML support with eslint-plugin-toml
   - ✨ Added YAML support with eslint-plugin-yml
   - ✨ Added ESLint comments plugin
   - ✨ Added interactive ESLint script

   Dependencies:

   - ⬆️ Updated all dependencies to latest versions
   - 📦 Added vue-eslint-parser and related packages

## 0.3.0

### Minor Changes

- d2913df: bump deps

## 0.2.12

### Patch Changes

- e549305: feat: turn off readonly props requirement

## 0.2.11

### Patch Changes

- 36caa99: feat: testing out classRegex setting on tailwind

## 0.2.10

### Patch Changes

- 8ead26d: feat(jsdoc): update jsdoc rules

   - Update `jsdoc/require-description` rule to allow any description style
   - Add `jsdoc/require-description` rule with `tag` style for stylistic configs

## 0.2.9

### Patch Changes

- eddf469: feat(config): enable stricter node rules for library code

   - Enable `node/no-unsupported-features/es-syntax` and `node/no-unsupported-featuresanode-builtins` rules for library code
   - Set `unicorn/prefer-global-this` to `warn` for library code
   - Update `eslint.config.js` to use `"lib-strict"` application type

## 0.2.8

### Patch Changes

- d243e1e: feat 💎: enable unicorn/prefer-global-this rule for library code

   - Enable `unicorn/prefer-global-this` rule for library code.

## 0.2.7

### Patch Changes

- 16f5d62: feat 📦: add next.js linting rules

   - The main goal of these changes is to enhance the linting rules for Next.js projects, specifically focusing on improving code quality, performance, and adherence to Next.js best practices.
   - Add support for Next.js.
   - Enable Next.js support for React rules.
   - Adding Next.js ESLint plugin.
   - Update dependencies, including `@next/eslint-plugin-next` and `glob`.
   - Migrated React type generation to support Next.js.
   - React configuration for ESLint, including support for TypeScript, Remix, and Next.js.
   - Add Tanstack ESLint plugin for Query.
   - Rename plugin names in ESLint and Next.js.
   - Add support for `@next/eslint-plugin-next`.
   - Add support for Google Fonts and Next.js specific linting rules.
   - Enable support for React, TypeScript, and Next.js.

## 0.2.6

### Patch Changes

- 20318c4: chore 📦: update dependencies and refactor ♻️ import statements.

   - Update dependencies.
   - Refactor import statements.
   - Add type guard for objects.

## 0.2.5

### Patch Changes

- d87bf3a: update deps

## 0.2.4

### Patch Changes

- d051260: feat(tanstack): add optional tanstack-query linting

   BREAKING CHANGE: The `tanstack` option now requires installing the `@tanstack/eslint-plugin-query` package to enable TanStack Query linting.

## 0.2.3

### Patch Changes

- 68c2ccd: fix: another tanstack bug

## 0.2.2

### Patch Changes

- dcf5971: fix: another bug in tanstack

## 0.2.1

### Patch Changes

- 1f9a717: fix: minor bug in tanstack

## 0.2.0

### Minor Changes

- 11655ee: feat: add tanstack config

## 0.1.6

### Patch Changes

- 0337c5d: stop ingonring rest unused vars

## 0.1.5

### Patch Changes

- 915bab7: update node and unicorn configs

   This commit updates the node and unicorn configuration files to include a new option for specifying the application type. The `node.ts` file now accepts an `OptionsAppType` parameter, which allows the user to specify whether the configuration is for an "app" or a "lib". Similarly, the `unicorn.ts` file also accepts the `OptionsAppType` parameter and includes a new rule, `unicorn/prefer-global-this`, which is enabled only for "lib" type applications.

   The changes were made in the following files:

   - `src/configs/node.ts`
   - `src/configs/unicorn.ts`
   - `src/factory.ts`
   - `src/types/common.ts`

## 0.1.4

### Patch Changes

- 75e4353: turn off ts rule no use before define

## 0.1.3

### Patch Changes

- f04d587: fix bug in node overrides
  change all imports to async
  update deps

## 0.1.2

### Patch Changes

- 04576cd: fix tailwind plugin bug

## 0.1.1

### Patch Changes

- a1fcc2d: added new option to ts-eslint no unsed vars rule

## 0.1.0

### Minor Changes

- 5d7f5ea: add node config

## 0.0.7

### Patch Changes

- 397a218: add new options to a few configs

## 0.0.6

### Patch Changes

- 93180c1: fix types for tailwind

## 0.0.5

### Patch Changes

- a2ff5fb: fix name collision reeact

## 0.0.4

### Patch Changes

- 1be7004: fix react plugin issue

## 0.0.3

### Patch Changes

- 1e427b9: fix ish on tailwind

## 0.0.2

### Patch Changes

- fa77bf5: enable react and tailwind byh default

## 0.0.1

### Patch Changes

- 09f8f01: first patch
