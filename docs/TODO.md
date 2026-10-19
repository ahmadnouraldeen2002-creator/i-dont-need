# TODO

Open items that are not yet a scheduled step. Every `TODO` comment in the code must have an entry here (CLAUDE.md section 4).

## Before M3

- [ ] **Re-check the runtime advisory GHSA-vcc3-ghjq-m6fr** (`decode-uri-component`, via `expo-router` → `query-string`) with `npm audit --omit=dev`, **even if the Expo SDK 58 upgrade is delayed**. Owner's request, 2026-10-19. Background in `docs/DECISIONS.md`.
- [ ] Propose the Expo SDK 58 upgrade to the owner (development builds start at M3).
- [ ] Watch for Expo Go for SDK 58 in the Play Store: from then on the store version no longer opens SDK 57 projects. Until the upgrade, install the Expo Go build for SDK 57 from expo.dev/go on the owner's phone.

## M0

- [ ] Step 0.6: add the CI checks as required status checks in ruleset `protect-main` (already approved by the owner).
- [ ] Step 0.6: review the dev-only `npm audit` findings.
- [ ] Owner decision pending: CLAUDE.md wording "anon key" → "publishable key" (see `docs/DECISIONS.md`).

## Later

- [ ] Re-run `npm audit --omit=dev` at every Expo SDK update.
- [ ] Re-check Betterleaks when its v2 is stable (it was `v2.0.0-rc.2` on 2026-10-19).
- [ ] M1: replace the placeholder screen `app/index.tsx` and its hard-coded `APP_NAME` text with the real shell and i18n strings.
- [ ] Before the first store upload: final app name and Android package ID / iOS bundle ID (`app.config.ts`).
- [ ] Before M10: the real app icon and splash screen (CLAUDE.md section 10) replace the placeholders.
