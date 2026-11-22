# checkout (bill splitter)

Split a restaurant bill between people: photograph the receipt (OCR with
tesseract.js) or enter items by hand, assign items to people, and get each
person's share including tax and tip.

## Layout

| Path | What it is |
|---|---|
| `src/` | Web app: React 19 + Vite + MUI. Receipt scanning, basic and advanced splits, summary page. |
| `mobile/` | Expo / React Native port (formerly the separate `chek` repo). Has a basic split screen and a pure split-logic module, `mobile/src/utils/checkoutUtils.ts`. See [mobile/README.md](mobile/README.md). |

The two apps have separate `package.json` files and toolchains. Root `jest` and
`eslint` cover only `src/`; run the mobile ones from `mobile/`.

## Development

```bash
npm install && npm run dev      # web
npm test                        # web tests

cd mobile && npm install
npm run web                     # or ios / android
npm test                        # mobile tests
```

## History

`mobile/` was folded in from [Sparky-code/chek](https://github.com/Sparky-code/chek)
(branch `chek/initial-commit`) with `git subtree add`, so its commits are
part of this repo's history.

---

## Template notes (Vite)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
