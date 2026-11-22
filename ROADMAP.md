# Roadmap

Legend: `[ ]` not started · `[~]` in progress · `[x]` done

## Fold-in follow-ups (from merging `chek` into `mobile/`)

- [ ] **Fix mobile Button tests.** `mobile/src/components/Button/Button.test.tsx`
  has 23 failing tests: they call `Button(...)` as a plain function instead of
  rendering it with React Native Testing Library, so `useState` has no
  dispatcher. Rewrite them to `render(<Button />)`. These failures came over
  from `chek`.
- [ ] **Restore commit hooks at the repo root.** `mobile/.husky/` hooks
  (commitlint + lint-staged) no longer install because the git root is now the
  parent folder (`npm install` in `mobile/` prints ".git can't be found").
  Decide on one root-level Husky setup that covers both apps, then remove or
  repoint `mobile`'s `prepare: husky` script.
- [ ] **Clear the web lint backlog.** `npx eslint .` reports 116 problems
  (115 errors, 1 warning) in `src/`. These predate the fold.

## Share split logic between web and mobile

- [ ] **Single source of truth for split math.** `mobile/src/utils/checkoutUtils.ts`
  is a pure, tested module (basic split, item-assignment split, initials,
  validation, person creation). The web app keeps the same logic inside
  components and hooks (`src/components/SummaryPage/hooks/useSummaryCalculations.ts`,
  `src/utils/stringUtils.ts`), and its tax/tip proration exists only there.
  Merge the two into one module that both apps import, with the web's tax/tip
  handling folded in. `mobile/src/types/checkout.ts` already covers everything
  in `src/types`, so start the shared types from it.
- [ ] **Restructure into a monorepo (eventually).** Sharing code cleanly needs
  a workspace layout, for example `apps/web`, `apps/mobile`, `packages/core`
  (split logic + types). **The mobile app must be preserved** through the
  restructure: keep it runnable and keep its history (move it with `git mv`,
  don't recreate it). The current `src/` + `mobile/` layout is a stepping
  stone, not the end state.
