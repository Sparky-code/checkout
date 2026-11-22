# checkout / mobile

The Expo / React Native version of the checkout bill splitter. It was the
separate `chek` repo until it was folded in here (see the root README).

## What's here

- `src/components/BasicSplit/`: an equal split of a total between N people.
- `src/utils/checkoutUtils.ts`: pure split logic with tests: basic split,
  advanced item-assignment split, initials, validation, person creation. This
  is a cleaner version of logic the web app (`../src`) keeps inside
  components and hooks. It is the natural candidate to share between the two apps.
- `src/types/checkout.ts`: domain types, a superset of `../src/types`.
- `prompts/`: coding guidelines and strategies for this app (React Native specific).

## Known issues

- `src/components/Button/Button.test.tsx`: 23 tests fail because they call
  `Button(...)` as a plain function instead of rendering it, so `useState`
  has no React dispatcher. This predates the fold.
- Husky commit hooks (`.husky/`) no longer install: `npm install` prints
  ".git can't be found" because the git root is now the parent folder.
  Commits are not linted until hooks are set up at the repo root.

---

## Template notes (expo-ts)

<p align="center">
  An opinionated template that will allow you to start a new React Native project quickly with Expo, TypeScript, Prettier, ESLint, and some custom configurations that will make development process better. 💖
</p>

<h1 align="center">Expo TypeScript</h1>
<br>

<img src="./screen.jpg" width="200"></img>

Using [Expo 53-beta](https://expo.dev/changelog/sdk-53-beta).

Please read [Starting React Native Project in 2025](https://dev.to/vladimirvovk/starting-react-native-project-in-2025-4n25) article for details.

## Quick start

1. Run `npx create-expo-app -t expo-ts` command.
2. Type your project name.
3. Change directory to your project with `cd <your-project-name>` command.
4. Run `npm run start` to start the Metro Bundler.
5. Press `i` to start the iOS simulator or `a` to run the Android emulator.📱

Happy hacking! 🤓

## Features

- [TypeScript](https://www.typescriptlang.org/).
- Absolute path imports (e.g. `import { ComponentA } from 'src/components/A'`).
- [Prettier](https://prettier.io/).
- Automaticaly sort imports on save.
- Check code for errors with [TypeScript compiler](https://www.typescriptlang.org/tsconfig#noEmit) and [ESLint](https://eslint.org/).
- Generate changelog with [standard-version](https://github.com/conventional-changelog/standard-version).
- Lint commits with [Husky](https://github.com/typicode/husky).
- [react-native-safe-area-context](https://docs.expo.dev/versions/latest/sdk/safe-area-context/).
- Write tests with [Jest](https://jestjs.io/) and [React Native Testing Library](https://testing-library.com/).

## Available commands

- `npm run start` - start Metro Bundler.
- `npm run ios` - run on iOS.
- `npm run android` - run on Android.
- `npm run web` - run on web.
- `npm run lint` - check code for errors.
- `npm run prettier` - run Prettier formatter.
- `npm run release` - generate a changelog, bump the version of app and create a new tag.
- `npm run test` - run tests.
