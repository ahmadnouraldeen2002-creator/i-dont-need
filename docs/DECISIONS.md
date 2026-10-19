# Decisions

Each entry: date, decision, reason. Newest at the bottom.
This repository is public: nothing in this file may contain secrets, personal data or account-security details.

## 2026-10-19 · Repository is public (owner's explicit approval under S26)

- **Decision:** the GitHub repository `ahmadnouraldeen2002-creator/i-dont-need` stays **public**. This is the owner's final, written decision and counts as the explicit approval required by S26 to make the repository public.
- **Owner's understanding (as stated by the owner):** everything in the repository (code, `CLAUDE.md`, `docs/`) is visible to everyone and can be copied, and anything ever pushed stays in the git history even if deleted later.
- **Rules from now on:** everything written to the repository is treated as public. Never commit secrets, keys, real user data, personal email addresses, or details of a vulnerability before it is fixed.
- **Upside:** unlimited free GitHub Actions minutes, free branch protection (rulesets), and free secret scanning with push protection on public repositories.
- **Proposed CLAUDE.md edit:** S26, S29 and S30 to be updated to match; awaiting the owner's approval.

## 2026-10-19 · No license file

- **Decision:** the repository has **no license** (owner's instruction). Being public does not grant anyone the right to reuse the code. Do not add a `LICENSE` file or a `license` field without the owner's approval.

## 2026-10-19 · Free GitHub protections turned on (owner approved)

- **Ruleset `protect-main`** on the default branch: changes only through a pull request (0 required approvals, since the owner is the only maintainer; merge method: merge commit), force-push blocked, deletion blocked, no bypass actors. The required CI status check will be added once the CI workflow exists.
- **Secret scanning** and **push protection**: already on by default for this public repository; verified.
- **Dependabot alerts**: turned on. Dependabot security updates and version updates are not turned on yet (S30; to be proposed with the CI step).
- **Actions: "Require approval for all external contributors"** (owner approved): changed from the default "first-time contributors" so workflows from anyone other than the owner never run without approval.
- No other repository setting was changed.

## 2026-10-19 · CLAUDE.md updated to version 1.3 (owner approved)

- **Decision:** S26, S29, S30 and the related lines in 3.7, 3.8, S28, M0 and section 13 now describe the public repository.
- **Owner's condition:** no security rule may be removed or weakened, and nothing is uploaded before the owner's "تمام". Both hold: the old rules are kept, and new ones were added (public-content rules, no account-security details in the repo, never bypass push protection, never weaken the ruleset, external-contributor approval, no license without approval).

## 2026-10-19 · Commit identity uses the GitHub no-reply email

- **Decision:** this repository's local git config uses `256418149+ahmadnouraldeen2002-creator@users.noreply.github.com` (the public GitHub no-reply address, not a personal email).
- **Why:** S26; the repository is public, so a personal email must never appear in commits. Verified on every existing commit.

## 2026-10-19 · Expo SDK 57 instead of 58

- **Decision:** start on Expo SDK 57 (`expo@57.0.30`, React Native 0.86).
- **Why:** SDK 58 became stable on 2026-10-15, but the Expo Go app for SDK 58 is not yet in the stores, so the owner could not run the app on the phone until development builds start (M3). 57.0.30 is above the minimum 57.0.17 required by CLAUDE.md section 2.
- **Revisit:** before M3 (when development builds start), propose the upgrade to SDK 58 to the owner.

## 2026-10-19 · Routes live in `app/` at the project root

- **Decision:** Expo Router routes are in `app/` (CLAUDE.md section 4), not `src/app/` as in the SDK 57 template. The `@/` alias points to `src/`.

## 2026-10-19 · Template trimmed

- **Decision:** the template's demo screens, demo components, images, `AGENTS.md`, `LICENSE` and `.claude/settings.json` were not copied. Dependencies only used by the demo (`@expo/ui`, `expo-device`, `expo-glass-effect`, `expo-symbols`, `expo-web-browser`) were removed; they will be added back with `npx expo install` when a feature needs them.
- **Placeholder images:** the app icon, splash and favicon are plain self-made placeholders (a white or green circle on the palette green), so no third-party artwork is in the repository. The real icon comes later (section 10, before M10).

## 2026-10-19 · Known `npm audit` findings in the Expo toolchain

- 29 publicly known advisories (11 moderate, 18 high), all in third-party packages inside the Expo / React Native / Metro build tooling, not in this project's code. None is fixable without changing the Expo SDK; `npm audit fix --force` would break SDK alignment. Re-check on each SDK patch update.
