# CLAUDE.md — Classifieds Marketplace App (`APP_NAME`)

> Version 1.4 · 2026-10-19. This file is the contract between the owner and Claude Code.
> Do not edit it without the owner's approval. Read sections 0 and 3 before doing anything.
> Changes in 1.1: the color palette now comes from the Kurdistan flag colors (decision D7 and section 10).
> Changes in 1.2: the owner's reply "تمام" to a step report now commits that step, uploads it to a private GitHub repository and continues with the next step (section 3.7), protected by rules S26–S30.
> Changes in 1.3 (approved by the owner): the GitHub repository is **public** by the owner's explicit decision (`docs/DECISIONS.md`). S26, S29, S30 and the related lines in 3.7, 3.8, S28, M0 and section 13 are updated; no security rule was removed or weakened, and nothing is uploaded before the owner's "تمام".
> Changes in 1.4 (approved by the owner): Supabase key names follow Supabase's current docs (publishable key instead of the legacy anon key, secret keys instead of the legacy service-role key; every rule applies to both the new and the legacy keys), and S11 states that `verify_jwt` alone is not enough. No security rule was removed or weakened.

---

## 0. Non-negotiable rules

1. **Speak to the owner in simple Arabic.** The owner is not a developer. No unexplained jargon: if you must use a technical term, explain it in one short sentence. Everything inside the repo (code, comments, commit messages, docs, identifiers) is in **English**.
2. **One small step at a time.** After every step send the report from section 3.5, then wait. When the owner replies "تمام" (or "تابع"), commit that step, upload it to GitHub (section 3.7) and continue with the next step. Never start the next step before that reply, and never upload before it.
3. **Never break what works.** Read existing code before changing it, make the smallest possible change, run `npm run check`. If you cannot make it pass, revert your change and tell the owner.
4. **Never guess** about accounts, secrets, money, legal text or product behavior. Ask (at most 3 short questions at a time) or choose the safest default and record it in `docs/DECISIONS.md`.
5. **No scope creep.** New ideas go to `docs/IDEAS.md`, not into the code.
6. **Security is a feature, not a phase.** Follow section 8 from the very first migration.
7. **Money:** never create, enable or recommend a paid service without telling the owner the expected cost first.
8. **Originality:** do not copy leboncoin's (or any other app's) name, logo, colors, icons, texts or distinctive layout. Functional similarity is fine.
9. If this file conflicts with the owner's latest explicit instruction, follow the owner, record it in `docs/DECISIONS.md`, and propose an edit to this file.
10. **Verify, do not assume.** For anything version- or policy-dependent (Expo, Supabase, Google Play, Apple, Meta), read the current official docs before implementing. Facts below were checked on 2026-10-19 and may change.

---

## 1. Product

**What it is:** a free classifieds app (like leboncoin). People list items for sale with photos, price and place. Others browse, then contact the seller **inside the app** and agree between themselves. Mainly for people in Syria and Syrians abroad, but available to everyone.

**Not in v1 (do not build):** payments, delivery, escrow, ratings/reviews, ads/promotions, real-estate and jobs categories, web app, voice/video calls, images inside chat, favorites, "near me" sorting. (First v1.1 candidates: favorites, near-me, share links.)

**Name:** placeholder `APP_NAME`, package `APP_ID`. The owner must choose the final name and the Android package ID / iOS bundle ID **before the first store upload; the package ID cannot be changed after publishing**. Keep both only in `app.config.ts`.

### Decisions locked by the owner

| # | Decision |
|---|---|
| D1 | Browsing and search are open to guests. Login (Google or Facebook only; no password, no phone number) is required only to message, post, report, block, or open the profile. After login, resume the action the user started. |
| D2 | A listing lives **at most 90 days**, then expires automatically. The seller is notified 7 days and 1 day before. |
| D3 | **"Sold"** → hidden at once, photos deleted at once, the record is hard-deleted after **14 days**. "Undo" within 14 days restores the text only; the seller must add photos again. |
| D4 | **Location:** public = governorate / city / neighborhood + an **approximate map circle (~500 m)**. The exact point/address is private; the seller may share it voluntarily in a chat. |
| D5 | **Currencies:** SYP, USD, EUR, TRY. The seller picks one per listing. No conversion. |
| D6 | **Languages:** Arabic (default, RTL), French, English, from day one. |
| D7 | **Design:** iPhone (Apple HIG) look on every platform. **Colors come from the Kurdistan flag** (red, white, green, golden yellow), used with restraint on a white/neutral base so the app stays calm, professional and does not look AI-generated (section 10). |
| D8 | **Stack:** Expo (React Native) + TypeScript; Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) in an EU region. |
| D9 | In-app chat is the only contact channel. Phone numbers are never collected. |

### Defaults chosen by Claude (owner may change; list them in `docs/DECISIONS.md` at M0)

- Western digits (0–9) everywhere, including Arabic UI.
- Expired listings can be republished by the seller within 14 days (creates a new 90-day listing); photos of expired listings are kept during those 14 days.
- Palette: green is the main color; red and golden yellow have small, fixed roles (section 10). The exact shades are the flag's colors slightly adjusted so text stays readable. Fonts and map provider are proposed at M1 / M5 for approval.
- Quotas, retention times and the starter categories are in Appendices A–C.

---

## 2. Tech stack (locked unless the owner approves a change)

| Layer | Choice / rule |
|---|---|
| Runtime | Node.js >= 22.13 (required by Expo SDK 57), npm |
| App | **Latest stable Expo SDK at project creation** (SDK 57 was the latest I could confirm on 2026-10-19; if a newer stable SDK exists, use that instead. If you use 57, take the latest 57.x patch, >= 57.0.17, which fixes a Hermes V1 memory regression with Reanimated that affected SDK 56 and early 57.x). Check expo.dev/changelog first. Install packages with `npx expo install`; run `npx expo-doctor`. |
| Language | TypeScript, `strict: true` |
| Navigation | Expo Router (read the docs of the installed SDK; it changes between SDKs) |
| Server state | TanStack Query. Tiny local UI state: React state or Zustand |
| Forms | react-hook-form + Zod |
| Lists | `@shopify/flash-list` for long lists |
| Backend | Supabase: Postgres + PostGIS + pg_trgm + pg_cron + pg_net, Auth, Storage, Realtime, Edge Functions. **Region: EU (Frankfurt or Paris)** |
| Push | expo-notifications (FCM v1 on Android) |
| i18n | i18next + react-i18next + expo-localization |
| Images | expo-image (display and cache), expo-image-picker, expo-image-manipulator, blurhash placeholders |
| Maps | MapLibre (`@maplibre/maplibre-react-native`) + a tile provider chosen at M5 with owner approval of cost. Fallback: react-native-maps. No Google Maps by default. |
| Monitoring | Sentry (crashes and performance, no personal data) |
| Tests | Jest + React Native Testing Library; pgTAP via `supabase test db`; Maestro for end-to-end |
| CI/Builds | GitHub Actions (typecheck, lint, tests, secret scan, `npm audit`); EAS Build; **development builds (`expo-dev-client`) from M3**, because Google/Facebook login do not work in Expo Go |

Adding a dependency needs: a one-line reason in `docs/DECISIONS.md`, a check that it is maintained (recent releases, widely used, permissive license) and a heads-up to the owner. Never upgrade the Expo SDK or a major version without approval.

---

## 3. How to work

### 3.1 Your first message (empty project)
Greet the owner in Arabic, restate the product in 6 lines, explain in 3 short lines what the owner's words "تمام", "اشرح" and "وقّف" do (3.6), then start **M0 step 0.1**: ask which operating system the owner uses and what is already installed. Wait for the answer.

### 3.2 Start of every session
Read this file and `docs/PROGRESS.md`. Run `git status` and compare local tags with `git ls-remote --tags origin`: a `step-*` tag that exists locally but not on GitHub is an approved step that was never uploaded, so retry its upload first (3.7). If `git status` shows uncommitted changes from a step the owner has not approved yet, say so and ask what to do (never discard them without asking). Tell the owner in Arabic (max 4 lines): where we are, what the next step is, anything blocked, and any approved step that is not yet on GitHub.

### 3.3 Before each step
One sentence in Arabic: what you are about to do. If you need something from the owner (account, key, decision), say exactly what, with click-by-click instructions, then wait.

### 3.4 Step size and Definition of Done
A step touches few files, is testable, and fits in about one hour of work; if bigger, split it. A step is **done** only when:
- `npm run check` passes (typecheck + lint + format check + unit tests);
- the app runs on the owner's phone/emulator with no new red-screen errors or warnings from our code;
- every visible string exists in `ar`, `fr`, `en`; layouts checked in RTL and LTR, light and dark;
- loading, empty and error states exist;
- any DB change has a migration, RLS policies and tests;
- the secret scan passes on this step's files (S28): stage them by explicit path, then run `npm run secrets:scan`;
- `docs/PROGRESS.md` is updated. Nothing is committed yet: the commit, the tag and the upload to GitHub happen when the owner replies "تمام" (3.7), so the owner tests exactly what will be uploaded.

### 3.5 Report after every step (Arabic, exactly this shape)
```
✅ الخطوة <رقم>: <اسم الخطوة>
ما الذي تم: <٢–٤ جمل بسيطة>
الملفات: <أهم الملفات التي تغيّرت>
جرّب بنفسك: <خطوات محددة على الهاتف للتأكد>
نتيجة الفحوصات: <نجحت / فشلت + التفاصيل>
ملاحظات أو مخاطر: <إن وُجدت>
ما أحتاجه منك: <قرار / حساب / مفتاح، أو "لا شيء">
الخطوة التالية: <اسمها>. اكتب "تمام" لأرفع هذه الخطوة على GitHub وأكمل مباشرة للخطوة التالية.
```

### 3.6 Owner's words
"تمام" (or "تابع") = the step is approved: commit it, upload it to GitHub, then continue with the next step (3.7). "تمام وقّف" = commit and upload, then stop and wait. "اشرح" = explain again, simpler. "وقّف" = stop and wait. "ارجع للخطوة X" = propose the safest rollback (see 3.7), explain it, wait for a yes. "تمام" counts as approval only as a reply to a step report; as an answer to any other question it just means "OK" (if unsure, ask "هل أرفع الخطوة على GitHub؟"). If the owner asks for a change instead, make it and send the report again; nothing is uploaded until "تمام".

### 3.7 Git and GitHub ("تمام" = commit, upload, continue)
- Initialise git at M0 and create the GitHub repository together with the owner (M0; security rules S26–S30). The repository is **public** by the owner's decision, so everything pushed is public forever (S26). One branch per milestone (`m3-auth`), one commit and one tag (`step-3.2`) per approved step, Conventional Commits (`feat`, `fix`, `chore`, `docs`, `test`, `refactor`).
- **End of a step:** the step's changes stay in the working tree (files staged by explicit path) after the checks and the secret scan pass. Send the report (3.5) and wait. Nothing is committed or pushed yet. If the owner asks for a change, make it and report again.
- **When the owner replies "تمام" (or "تابع") to a step report:** (1) re-run `npm run check`, then look at `git status` and `git diff --cached --stat`: only this step's files, no secrets, no `.env`; (2) `git commit` (the pre-commit hook scans again); (3) tag the commit `step-X.Y` (a tag always marks an approved step, and it is how the owner can go back to it); (4) push only the milestone branch and that tag (`git push -u origin <branch> step-X.Y`); never use `--force`, `--all`, `--mirror` or `--no-verify`; (5) wait for the GitHub Actions run with `gh run watch --exit-status` (at most 10 minutes; if GitHub CLI is missing, do not block: give the owner the link and check the result in the next report); (6) tell the owner in Arabic, in 3 short lines: uploaded or not, CI green or red, link to the commit; (7) **start the next step at once** (3.3).
- **Do not start the next step** (ask or wait instead) when: CI is red (fix it in a new commit, tag it `step-X.Y.1`, and ask for "تمام" again before pushing the fix); the push failed; the next step needs something from the owner (an account, a key, a decision); or the milestone just ended (next bullet). "تمام وقّف" = do (1)–(6), then stop.
- **End of a milestone:** after uploading its last step, send a short milestone report (what works now, the `docs/QA.md` checklist to try on the phone) and wait. On the owner's "تمام": open a pull request from the milestone branch into `main`, wait for CI green, merge it with a normal merge commit (not squash, so every step stays visible), create the next milestone branch from the updated `main`, and start its first step. Never push directly to `main`; the only commit made directly on `main` is the initial `.gitignore` at M0.
- If the push fails (login expired, no internet, rejected): never retry with force or other tricks. Explain simply (3.9). The local tag stays, which marks the step "approved, not uploaded"; retry at the start of the next session (3.2).
- Rollback = `git revert` or a new branch from a tag. Never force-push, never rewrite pushed history, never delete branches or tags (local or on GitHub) without asking. Only exception: removing a leaked secret from history, with the owner's approval and only after the secret was revoked (S28).

### 3.8 Never without explicit approval
Deleting files you did not create in the current step; `supabase db reset`, dropping or truncating anything on any database; touching the **production** Supabase project; upgrading the Expo SDK or any major dependency; editing this file; uploading anything to GitHub before the owner's "تمام" (3.7); changing the GitHub repository's visibility, collaborators, rulesets, branch protection, secret scanning, Actions settings, secrets or any other setting; adding a license file or `license` field; adding a third-party GitHub Action (S30); committing secrets or large binaries; disabling lint/type/test rules to make something pass; using `any`, `@ts-ignore` or `eslint-disable` without a comment **and** telling the owner.

### 3.9 When something fails
Stop. Explain in Arabic, simply, what failed and why. Offer one or two options. Do not stack workarounds. After two failed attempts at the same fix, stop and ask.

### 3.10 Documentation files you maintain
`docs/PROGRESS.md` (done / next / blocked), `docs/DECISIONS.md` (what and why), `docs/TODO.md`, `docs/IDEAS.md`, `docs/RUNBOOK.md` (incidents, section 8 S25), `docs/QA.md` (manual test checklist per milestone, written so the owner can follow it on a phone), `docs/PERF.md` (measurements).

---

## 4. Architecture and code conventions

```
app/                     # Expo Router routes. THIN: compose feature screens only
src/
  features/<feature>/    # auth, listings, search, chat, profile, reports, notifications, locations
    screens/ components/ hooks/
    services/            # the ONLY place that calls Supabase for this feature
    schemas/             # Zod schemas (validation at every boundary)
    index.ts             # public API of the feature
    __tests__/
  components/ui/         # design-system primitives (no feature knowledge)
  lib/                   # supabase client, i18n, errors, logger, env/config (Zod-validated)
  theme/                 # tokens.ts, useTheme
  i18n/                  # ar.json, fr.json, en.json
  types/database.ts      # GENERATED by `supabase gen types`. Never hand-edit.
supabase/
  migrations/            # SQL migrations. Never edit an applied one; add a new one.
  functions/             # Edge Functions
  tests/                 # pgTAP / RLS tests
  seed.sql
docs/
```

**Rules**
- Dependency direction: `app` → `features` → `components/ui`, `lib`, `theme`. A feature never imports another feature's internals, only its `index.ts`.
- Components render; hooks hold logic; services talk to the backend. No Supabase calls in components or routes.
- Services return typed results or throw a typed `AppError`. Supabase errors are mapped to error codes, then to translated, friendly messages. Raw errors are never shown to users.
- Validate all external input with Zod (client) **and** DB constraints/RPC checks (server).
- Named exports (default exports only where a route file requires it). Path alias `@/`. Files <= 300 lines, functions <= 50 lines. No dead or commented-out code. No magic numbers (constants file). No `TODO` without an entry in `docs/TODO.md`.
- Naming: files `kebab-case`, components `PascalCase`, hooks `useThing`, DB tables/columns `snake_case`.
- Config: `.env` is git-ignored; `.env.example` is committed. In the app bundle only the Supabase URL, the Supabase publishable key (formerly the anon key), the Sentry DSN and the map key may appear (`EXPO_PUBLIC_*`). Real secrets (including Supabase secret keys and the legacy service-role key) live only in Supabase secrets / EAS secrets.
- Scripts: `npm run check` (typecheck + lint + format:check + test), `secrets:scan` (staged changes; run by the pre-commit hook), `secrets:scan:history` (whole git history; run by CI), `db:types`, `db:push`, `db:test`.
- Two Supabase projects: `-dev` (everything until M9) and `-prod` (M10). Never test on prod.

---

## 5. Product spec (v1)

### 5.1 Navigation
Four tabs: **Home** (search bar + category chips + feed), **Sell** (+), **Messages**, **Profile**. Large-title headers, back gesture, iOS-style sheets.

### 5.2 Guest vs signed-in
Guests can: browse, search, filter, open a listing, see the approximate map, change language/theme. Protected actions (message, sell, report, block, profile, notifications) open a **login sheet** (Google, Facebook; Apple added for iOS, see M10) with one line explaining why, then continue the original action. First login: accept Terms and Privacy Policy (versioned).

### 5.3 Listing
- Photos: 1–8. Title 5–100 chars. Description 20–4000 chars. Category (required). Condition (new / like new / used / for parts), optional.
- Price: amount + currency (SYP, USD, EUR, TRY) + type (fixed, negotiable, free, "contact me"). Amount is optional for free/contact.
- Location: governorate → city → neighborhood (optional) + optional map pin. Private address note (optional).
- Contact: in-app chat only. No phone numbers or emails shown.
- Text is rendered as plain text only (no HTML/Markdown).

### 5.4 Lifecycle
```
active ──sold──▶ sold ──14 days──▶ deleted
active ──90 days──▶ expired ──14 days──▶ deleted   (seller may republish in between)
active ──moderator──▶ removed ──90 days──▶ deleted (evidence/appeals)
```
- Hidden from all public queries the moment status leaves `active`.
- Sold/removed: photos enqueued for deletion immediately. Expired: photos kept 14 days for republish.
- Undo sold (within 14 days): restores text; at least one photo must be added before it goes live again.

### 5.5 Search and discovery
Keyword search with **Arabic normalization** (strip diacritics and tatweel; unify alef forms أ إ آ → ا; ى → ي; ة/ه handling; Arabic-Indic ↔ Western digits) stored in a normalized `search_text` column. Filters: category, price range (+currency), governorate/city, condition. Sort: newest (default), price asc/desc. **Keyset pagination** (created_at, id), 20 per page, infinite scroll. Remember the last chosen region locally.

### 5.6 Chat
One conversation per (listing, buyer). Text only, max 1000 chars. Realtime, unread counts, read receipts. Header shows a listing snapshot card. Seller-only action **"Share pickup location"** (confirmation dialog) sends the exact point/address note as a `location` message. Block and Report available inside chat. Blocked users cannot message. Conversations stay readable after the listing is sold/expired until the retention rules in Appendix B delete them.

### 5.7 Notifications
New message; listing expiring (7 days, 1 day); listing removed by moderators. No marketing pushes. Ask for notification permission **in context** (after the first post or first chat), never at launch. Settings toggles.

### 5.8 Profile and account
Display name (default "First L." from the provider), optional avatar, language, theme, my listings (Active / Sold / Expired), blocked users, legal links, contact/appeal email, **delete account** (in-app, required by Google Play and Apple; also needs a web page/URL for the store forms and Facebook).

### 5.9 Safety and moderation (user-generated content rules of the stores)
Terms prohibit objectionable content (Appendix D). Report listing / user / message with a reason. Block user. Keyword flagging for review (Arabic, French, English). Reports queue with moderator actions: remove listing, ban user, dismiss; every action is audit-logged and the affected user is notified. Owner process target: review reports within 24 h.

### 5.10 Localization and RTL
- Arabic is the source language; write simple, neutral Modern Standard Arabic (no heavy dialect, no machine-translation feel). French and English by Claude, flagged in `docs/DECISIONS.md` as needing native review.
- No hard-coded strings. Use i18next plural rules (Arabic has six forms).
- Use logical style props (`marginStart`, `paddingEnd`, `start`/`end`, `textAlign: 'auto'`); never hard-code left/right. Flip directional icons (chevrons, back arrows). Test long Arabic strings.
- Changing between Arabic and French/English changes direction: handle the required reload gracefully.
- Dates: relative times ("3 days ago") via a tested helper. Prices: one `formatPrice()` util with unit tests (SYP, USD, EUR, TRY).

### 5.11 Image pipeline
Pick up to 8 → client resize (long edge <= 1280 px, quality ~0.75, JPEG/WebP) → create a 400 px thumbnail → **strip EXIF/GPS (prove it with a test or exiftool)** → compute blurhash → upload with progress, retry and a persisted queue. Targets: full image <= 400 KB (hard limit 1 MB), thumbnail <= 60 KB. Upload to `{user_id}/{random}.{ext}`; `create_listing` links the paths; anything unreferenced after 24 h is swept.

---

## 6. Data model (implement via migrations; names are a spec, not SQL)

**Enums:** `listing_status` (active, sold, expired, removed) · `price_type` (fixed, negotiable, free, contact) · `currency_code` (SYP, USD, EUR, TRY) · `condition_type` · `report_target` (listing, user, message) · `report_status` · `message_kind` (text, location, system) · `user_role` (user, moderator, admin).

| Table | Key columns / rules |
|---|---|
| `profiles` | id (= auth user, cascade), display_name, avatar_path, locale, is_banned, accepted_terms_version/at, created_at, last_seen_at. No email/phone here. Clients cannot write `is_banned`. |
| `user_roles` | user_id, role. Writable only by the `service_role` database role (used by secret keys and the legacy service-role key). |
| `locations` | id, parent_id, level (country/governorate/city/neighborhood), country_code, slug, name_ar/fr/en, centroid, sort_order. Country-agnostic; seed Syria first. |
| `categories` | id, parent_id, slug, name_ar/fr/en, icon, sort_order, is_active. Data, not code (Appendix A). |
| `listings` | id, seller_id, category_id, title, description, price_amount numeric(18,2), price_currency, price_type, condition, location_id, **approx_point** geography, approx_radius_m (500), status, created_at, updated_at, **expires_at** (created + 90 d), sold_at, **purge_after**, republished_from, search_text (trigger-maintained), flagged. |
| `listing_private` | listing_id (PK), **exact_point**, address_note. Owner-only. Never exposed through any public view. |
| `listing_images` | id, listing_id, position, path_full, path_thumb, width, height, blurhash, size_bytes. Max 8 per listing. |
| `conversations` | id, listing_id (nullable, `ON DELETE SET NULL`), listing_snapshot jsonb (title, price, currency), buyer_id, seller_id, last_message_at, per-user last_read_at and hidden_at, retain_until (set to now + 30 days when the listing is purged, or later if tied to an open report; `purge_conversations` deletes rows past it). Unique (listing_id, buyer_id); buyer <> seller. |
| `messages` | id, conversation_id, sender_id, kind, body (<= 1000), payload jsonb, created_at. |
| `blocks` | blocker_id, blocked_id (PK both). |
| `reports` | id, reporter_id, target_type, target_id, reason, details, status, created_at, handled_by/at, resolution_note, evidence jsonb. |
| `push_tokens` | id, user_id, token (unique), platform, locale, last_seen_at. |
| `storage_deletion_queue` | id, bucket, path, attempts, last_error, enqueued_at, done_at. |
| `job_runs` | id, job_name, started_at, finished_at, ok, affected, error. |
| `audit_log` | id, actor_id, action, target_type, target_id, meta, created_at. |
| `app_config` | key, value jsonb. Public subset via a view: `min_supported_version`, `maintenance`. Quotas are private. |

**Views:** `public_listings` (active, not expired, seller not banned; safe columns only, includes primary thumbnail), `public_profiles` (display name, avatar, member-since).

**RPCs (SECURITY DEFINER, `set search_path = ''`, validate `auth.uid()` and inputs, enforce quotas):** `create_listing`, `update_listing`, `mark_listing_sold`, `undo_mark_sold`, `republish_listing`, `start_conversation`, `send_message`, `share_pickup_location`, `mark_conversation_read`, `report_content`, `block_user`, `register_push_token`, `search_listings`. Account deletion is an Edge Function (it must delete Storage objects and the auth user in the right order).

**Indexes (minimum):** listings (status, category_id, created_at desc, id) partial `where status='active'`; listings (location_id, created_at desc) partial active; GIN trigram on `search_text`; messages (conversation_id, created_at desc); conversations (buyer_id, last_message_at desc) and (seller_id, last_message_at desc); reports (status, created_at); push_tokens (user_id). Add GIST on `approx_point` only when near-me ships.

**Approximate location:** compute server-side in `create_listing`/`update_listing`: exact point → stable pseudo-random offset (seeded by listing id and a server secret) within the radius. The exact point is never sent to other users except through an explicit chat share. If the seller gives no pin, `approx_point` stays null and the app shows only the area name (never a circle around a city centre that looks precise).

**Storage:** bucket `listing-images` (public read; write only to the caller's own prefix; allowed types jpeg/webp; size limit 1 MB). **Delete objects only through the Storage API (max 1000 per call), never with SQL** (SQL deletion leaves orphaned files that keep consuming space; confirmed in Supabase docs).

---

## 7. Lifecycle and background jobs

All jobs are idempotent, batched (LIMIT 500), and write to `job_runs`; failures alert the owner (Sentry or email).

| Job | Schedule | Action |
|---|---|---|
| `expire_listings` | every 15 min | active and expires_at <= now → expired; purge_after = now + 14 d |
| `notify_expiring` | daily | push at 7 d and 1 d before expiry |
| `storage_worker` (Edge Function) | every minute | process `storage_deletion_queue` via Storage API with retries/backoff |
| `purge_listings` | daily | where purge_after <= now: enqueue remaining images, then delete rows |
| `purge_conversations` | daily | per Appendix B |
| `orphan_sweep` | daily | delete unreferenced storage objects older than 24 h |

`mark_listing_sold` and moderator removal enqueue image deletions and delete the matching `listing_images` rows in the same transaction. `purge_after` is set by the status change: now + 14 days for sold and expired, now + 90 days for removed.

---

## 8. Security requirements (use these IDs in reviews)

The Supabase **publishable key (formerly the anon key) is public**, and so is the legacy anon key while it still exists. The database is protected only by RLS and server-side functions. Do not promise "unhackable"; deliver defense in depth and tests.

- **S1** RLS on every table in `public`, default deny, one policy per operation. Tests prove: guests cannot read non-public rows; user A cannot read/write user B's data; no role escalation.
- **S2** Supabase secret keys (`sb_secret_...`) and the legacy service-role key never appear in the app, in git, or in logs. Only Edge Function secrets and CI secrets.
- **S3** Writes that need rules (create/update listing, send message, report, block) go through RPCs or tightly constrained policies. Protected columns (status, expires_at, seller_id, role, is_banned, purge_after) are not client-writable (column privileges/triggers).
- **S4** Public data goes through `public_*` views exposing safe columns only. Views must not bypass RLS by accident: use `security_invoker = true` (or column-level grants) and make the Supabase Advisors show no security-definer-view findings. Tests assert that no API response to another user contains exact location, address note, email or push tokens.
- **S5** Approximate location rules from section 6 are enforced server-side.
- **S6** Validate on client, in DB constraints and in RPCs. No dynamic SQL (or only with `%I`/`%L`). Render user text as plain text. Sanitize file names.
- **S7** Auth: Google/Facebook (Apple at iOS release) via Supabase Auth; state/nonce/PKCE validated; redirect URL allow-list; session stored with an encrypted storage adapter (`expo-secure-store`-based; mind its size limit). **Verify and document Supabase account-linking behavior** so an unverified provider email can never take over an existing account. Check Supabase docs for the current recommended Google/Facebook flow (native ID token vs browser OAuth).
- **S8** Rate limits and quotas in DB/RPC (Appendix C), with friendly errors. Cap page sizes (<= 50). Add Cloudflare/WAF in front only if scraping is observed (M9).
- **S9** Storage rules as in section 6; no SVG/HTML uploads; orphan sweep.
- **S10** Realtime: private channels with authorization so only conversation participants can subscribe; unsubscribe on unmount.
- **S11** Edge Functions: verify JWT, validate input, minimal CORS, idempotent, timeouts, no secrets in logs. **`verify_jwt` alone is not enough:** the platform check also accepts the public publishable key (and the legacy anon key), so it never proves that a signed-in user is calling (Supabase docs, checked 2026-10-19: "The check alone doesn't authenticate a caller that sends only an API key"). Every function therefore verifies the caller inside its own code: validate the user's token with Supabase Auth using the method in Supabase's current docs (on 2026-10-19: `withSupabase` with `auth: 'user'` from `@supabase/server`), require a signed-in user, refuse banned users, and use only that verified user id for every permission check (never a user id taken from the request). Functions called only by cron jobs or other server code verify a dedicated secret instead. Tests prove that a call carrying only the publishable key, or no token, is refused.
- **S12** Separate dev/prod projects and keys; `.env` ignored; secret scanning before every commit and in CI (S28); rotate immediately if anything leaks.
- **S13** Lockfile committed; `npm audit` in CI; monthly dependency review; no abandoned packages.
- **S14** Android release hardening: R8/minify and resource shrinking on, `allowBackup=false`, no debuggable release, HTTPS only (no cleartext), validated deep-link schemes, minimal exported components, no WebView bridge to untrusted content.
- **S15** Logs and Sentry never contain tokens, message text, emails or exact locations. Use user UUIDs only.
- **S16** Privacy: minimal data (name, email held by Auth, avatar, approximate location, content). Email never shown to others. Phone never collected. EXIF stripped. Retention per Appendix B. Account deletion works end to end.
- **S17** Banned users are refused by RLS (`not is_banned`). Moderator and admin actions are audit-logged.
- **S18** No admin features in the public app. Moderation via Supabase dashboard/RPCs restricted to the `moderator` role. **MFA on every owner account** (GitHub, Supabase, Google, Meta, Expo, Play Console).
- **S19** Backups enabled (paid plan) and **a restore actually tested** before launch; weekly export of critical tables.
- **S20** Sentry + Supabase logs; review the Supabase Security and Performance Advisors before every release; alerts for job failures and error spikes.
- **S21** Force-update gate (`min_supported_version`) and a maintenance switch (`maintenance`) read at launch.
- **S22** `statement_timeout` for client roles (~8 s); parameterized queries only; trigram index actually used for search (verify with EXPLAIN).
- **S23** Prohibited-keyword flagging; report flow; optional automated image moderation later.
- **S24** RLS test suite runs in CI. Before launch run a self-attack session: act as an attacker holding only the publishable key (and the legacy anon key while it exists) and two test users, try every table and RPC, then document results. Walk through OWASP MASVS.
- **S25** `docs/RUNBOOK.md`: how to disable sign-ups, switch on maintenance mode, revoke keys and tokens (including GitHub), what to do if a secret was committed (S28), restore a backup, and who to contact. No secrets in this file.
- **S26 GitHub account and repository.** The repository is **public** by the owner's explicit, written decision (recorded in `docs/DECISIONS.md` on 2026-10-19 after a review of its contents). Everything committed is visible to everyone, can be copied, and stays in the git history forever even if deleted later. Therefore never commit: secrets or keys (of any environment), real user data, personal email addresses or other personal data, account-security details (for example which protections are or are not enabled on an owner account), or details of a vulnerability before it is fixed; tell the owner those in the chat only. Before every commit, review the staged content as public. No license file or `license` field without the owner's approval (public does not mean free to reuse). The owner's GitHub account has two-factor authentication (passkey or authenticator app), a unique strong password kept in a password manager, and recovery codes stored offline (never in the repo, the chat or a screenshot). In GitHub → Settings → Emails turn on "Keep my email addresses private" and "Block command line pushes that expose my email", and set git `user.email` to the GitHub no-reply address, so the owner's real email never appears in commits. Claude Code walks the owner through these settings at M0, one click at a time. Because the repository is public, the status of these account settings is never written in the repository (not in `docs/RUNBOOK.md` either); `docs/RUNBOOK.md` only describes how to check and change them.
- **S27 Credentials used to push.** The owner signs in himself, once, in the browser or at the terminal prompt. Preferred: GitHub CLI (`gh auth login`) or Git Credential Manager, which keep the sign-in token in the operating system's credential store. These sign-ins can reach every repository of the account, so use a GitHub account that holds only this project's repositories. If the account holds other repositories, use a fine-grained personal access token limited to this one repository instead (permission Contents: read and write; add Workflows: read and write only when `.github/workflows/` must change; expiry 90 days at most; check the current permission names in GitHub's token settings). Claude Code never asks for a token or key in the chat, never writes one into a file, `.env`, shell history, commit or log, never prints one, and never reads credential files (`~/.ssh`, `~/.config/gh`, `.git-credentials`, the keychain). If a credential leaks: tell the owner at once, revoke it in GitHub, create a new one.
- **S28 No secrets in git.** `.gitignore` is the very first commit, before any other file, and covers at least: `.env*` (except `.env.example`), `*.jks`, `*.keystore`, `*.p8`, `*.p12`, `*.pem`, `*.key`, Firebase config files (`google-services.json`, `GoogleService-Info.plist`), service-account JSON files, `supabase/.temp`, `.expo`, `node_modules` and build outputs. Firebase config files reach EAS builds as EAS file variables, not through git (read the current Expo docs). Two gates, both **fail-closed** (if the scanner is missing, the commit or the CI run fails): a **pre-commit hook** that scans the staged changes, installed automatically by `npm install` (for example Husky's `prepare` script) so a fresh clone is protected too, and a **CI job** that scans the whole history. Default scanner: gitleaks (hook: `gitleaks git --pre-commit --staged --redact`; CI: `gitleaks git`; its commands changed in v8.19, so read the current docs). Gitleaks is feature-complete and receives security fixes only, and its author announced a successor, Betterleaks, in March 2026 (its stable v2 was not out on 2026-10-19): re-check at M0 and record the choice in `docs/DECISIONS.md`. On this public repository GitHub's own secret scanning and push protection are on (free for public repositories; verified 2026-10-19). They are an extra layer only: they know only some secret formats, so never rely on them; the two gates above remain mandatory and are the real protection. Never bypass a push-protection block; treat it like a gate failure. Never use `--no-verify`. An allowlist entry is allowed only for an obviously fake test value, with a comment, and the owner is told. Stage files by explicit path. No real user data, database dumps, production keys or signing keys in git, ever. If a secret is ever committed, even if never pushed: treat it as leaked, **revoke or rotate it first**, tell the owner, and only then clean the history with the owner's approval (deleting it from history does not make it safe again).
- **S29 Protecting `main`.** `main` changes only through a pull request with CI green, with force-push and deletion blocked. On a public repository GitHub enforces this for free. Ruleset `protect-main` (on since 2026-10-19) targets the default branch: pull request required (0 approvals, since the owner is the only maintainer; merge commits only), force-pushes blocked, deletion blocked, no bypass actors. As soon as the CI workflow exists, add its checks as required status checks (owner already approved this). Claude Code never weakens, disables or bypasses the ruleset without the owner's approval, and still follows 3.7 by itself (the ruleset is a second line of defense, not a replacement for the owner's "تمام").
- **S30 GitHub Actions and dependencies.** Workflows live in `.github/workflows`. Top-level `permissions: contents: read`, with more only for the one job that needs it; never the `pull_request_target` trigger; every action pinned to a full commit SHA, and as few actions as possible (a third-party action needs a reason in `docs/DECISIONS.md` plus a check of its maintenance and license). Secrets exist only as GitHub Actions secrets, only in the jobs that need them, never echoed; if one appears in a log, delete the log and rotate the secret. Linux runners only, and CI never deploys to production (releases are manual, M10). Because anyone can open a pull request on a public repository: Actions setting "Require approval for all external contributors" is on (since 2026-10-19), so workflows from outside contributors never run without the owner's approval; workflows never expose secrets to pull requests from forks; and Claude Code never approves a run or merges a pull request from someone other than the owner without the owner's explicit approval. Turn on Dependabot alerts, security updates and version updates (npm and GitHub Actions; SHA-pinned actions are only kept current by version updates); if one is not offered on the owner's plan, tell the owner. Dependabot pull requests are reviewed, never merged blindly: packages pinned by the Expo SDK stay at the versions `npx expo install --check` accepts, and major upgrades need the owner's approval (3.8).

---

## 9. Performance and scalability

- **Target:** comfortably serve >= 10,000 daily users and >= 1,000 simultaneous users on a normal paid Supabase plan without code changes; growth beyond that should be a plan upgrade, not a rewrite. Verify current Supabase quotas (database size, Realtime concurrent connections, egress) and tell the owner the expected monthly cost before M10.
- **Mobile budgets (Syria assumptions: weak, unstable networks; low-end Android with 2–3 GB RAM):** cold start to first listings < 3 s on 4G; 60 fps scrolling; first-screen payload < 300 KB excluding images; AAB download kept small; test on a real low-end device.
- **Database:** keyset pagination only (no OFFSET on feeds); select only needed columns; index every query that powers a list or search; run `EXPLAIN ANALYZE` on each before accepting M4; RLS policies use `(select auth.uid())` and indexed columns; avoid N+1 with views/RPCs that return shaped payloads; use the connection pooler for functions.
- **Realtime:** connect only on Messages/Chat screens (one inbox channel + one channel per open conversation). Browsing never holds a realtime connection. Fall back to push + refetch.
- **Client:** TanStack Query with sensible `staleTime`; expo-image caching with blurhash; prefetch the next page; show cached data offline with a banner; retries with backoff; optimistic message sending; skeleton loaders.
- **Load test** before launch (k6 or Artillery): feed, search, listing detail, message insert, job runs. Record results in `docs/PERF.md`. Use a seeded dataset (>= 500 fake listings), never real data.

---

## 10. UI/UX: iPhone look, not AI look

**Principle:** content first. Real product photos are the visual hero. Typography and spacing create hierarchy. The palette is the Kurdistan flag's colors, but white and neutral grays carry the screens: green is the one interactive color, and red and golden yellow appear only in small, fixed roles (below). Everything follows Apple's Human Interface Guidelines, and looks the same on Android.

**Palette source (decision D7):** the owner chose the Kurdistan flag colors: red #ED2024, white #FFFFFF, green #278E43, golden yellow #FEBD11. Used raw, red and green on white give only 4.35:1 and 4.17:1 (text needs 4.5:1) and yellow on white gives 1.68:1, so the UI uses the slightly deepened shades below, computed and checked on 2026-10-19. The owner approves the look on a real phone at M1.

**Tokens** (single file `src/theme/tokens.ts`; no hex values anywhere else, except that `app.config.ts` may import values from it for the splash screen and icon background, so keep `tokens.ts` free of React Native imports; every text pair must pass WCAG AA):

| Token | Light | Dark | Used for |
|---|---|---|---|
| background | #FFFFFF | #000000 | screens (the flag's white) |
| grouped background | #F2F2F7 | #000000 | grouped lists, chat screen |
| elevated surface | #FFFFFF | #1C1C1E | cards, sheets, received chat bubbles |
| label (primary text) | #1C1C1E | #FFFFFF | all main text, prices |
| secondary label (also used for placeholders) | #6B6B70 | #AEAEB2 | captions, hints |
| tertiary (disabled or decorative only, never readable text) | #8E8E93 | #636366 | disabled controls |
| separator (0.5 pt hairline) | #C6C6C8 | #38383A | lines between rows |
| input fill | #F2F2F7 | #1C1C1E | text fields, search bar |
| **primary** (green) | #237E3B | #237E3B | fills: filled buttons, switch on, sent chat bubbles |
| onPrimary | #FFFFFF | #FFFFFF | label on a green fill |
| primaryText | #237E3B | #2EA84F | green text, links, icons, selected tab, focus ring |
| primaryTint | #EEF6F0 | #15321D | tinted buttons, selected chips, "active" pill (text in `primaryText`) |
| **danger** (red) | #DA1216 | #DA1216 | fills: unread badge, destructive button |
| onDanger | #FFFFFF | #FFFFFF | label on a red fill |
| dangerText | #DA1216 | #F36467 | error text, destructive text and icons |
| dangerTint | #FDEDED | #450D0E | error banners, "removed" pill (text in `dangerText`) |
| **highlight** (golden yellow) | #FEBD11 | #FEBD11 | fill only: the strongest warning pill, brand moments |
| onHighlight | #1C1C1E | #1C1C1E | label on a yellow fill |
| warningText | #8F6801 | #FEBD11 | warning text and icons |
| warningTint | #FDF4DD | #382C0A | warning and notice banners and pills (text in `label`, icon in `warningText`) |

**Color roles (strict):**

1. **White and neutral grays carry the app.** At least ~90% of every screen is background, surface, text and separators. Prices and titles use `label`, never a color.
2. **Green is the only interactive color:** filled, tinted and plain buttons, links, the selected tab, chip and segment, switches, the focus ring, sent chat bubbles (`primary` fill, `onPrimary` text), progress indicators, the "active" listing pill, and the approximate-location circle on the map (2 pt `primary` stroke plus 15% `primary` fill). Pressed state = 80% opacity; no extra shades. Chat: screen on `grouped background`, received bubbles on `elevated surface`.
3. **Red means attention or danger, never decoration:** unread badges (tab bar and conversation list), error and validation messages, destructive actions (delete listing, delete account, report, block) and the "removed" pill. If the owner approves it at M1, one small red accent in the logo.
4. **Golden yellow means "warning" and brand:** notice banners and pills (listing expires soon, offline, under review), where `highlight` fill is used only for the strongest one ("expires tomorrow"), and brand moments (app icon, splash screen, logo accent). Yellow never appears as text or thin lines on light backgrounds; text on a yellow fill is always `onHighlight`.
5. **Keep red and yellow small and quiet:** solid red or yellow fills stay small (badges, pills, destructive buttons); never a full-width solid red or yellow bar. Never put a red fill next to a green fill: large red and green areas together look garish, not professional.
6. **Color blindness:** the UI red and green have almost the same lightness (1.01:1), so many color-blind people cannot tell them apart. Every state shown in red or green must also carry a text label or an icon (pills always contain words; errors always show an icon and a message).
7. **Colors only, no flag:** never draw the flag, its stripes or the sun emblem in the UI, and never build red-white-green bands, headers or borders, unless the owner asks for that in writing.
8. **Enforce it with a test.** `src/theme/tokens.test.ts` computes contrast for light and dark and fails if: `label`, `secondaryLabel`, `primaryText`, `dangerText` or `warningText` is below 4.5:1 on `background`, `grouped background` or `elevated surface`; `label` or `secondaryLabel` is below 4.5:1 on `input fill`; `onPrimary`/`primary`, `onDanger`/`danger`, `onHighlight`/`highlight`, `primaryText`/`primaryTint`, `dangerText`/`dangerTint` or `warningText`/`warningTint` is below 4.5:1; `label` is below 4.5:1 on any of the three tints; or `primary` or `danger` is below 3:1 against `background` or `elevated surface`. The values above pass all of these (verified 2026-10-19), so any later change to a token must keep the test green.

**App icon and splash screen:** designed only after the owner has chosen the final app name (no later than the start of M10). Propose three simple options built only from this palette (no flag, no stripes, no sun emblem); the owner chooses.

**Typography:** iOS uses the system font (SF). On Android propose a bundled font with Latin + Arabic support (default proposal: IBM Plex Sans Arabic) for consistent rendering; owner approves at M1. Scale (pt, size/line): Large Title 34/41 bold · Title 28/34 · Title 2 22/28 · Title 3 20/25 · Headline 17/22 semibold · Body 17/22 · Callout 16/21 · Subhead 15/20 · Footnote 13/18 · Caption 12/16. Arabic gets ~10–15% extra line height. Respect system font scaling (cap at 1.3x in tight UI).

**Layout:** 4-pt grid; 16 pt screen margins; section gap 24; touch targets >= 44×44; cards radius 12 (continuous corners on iOS: `borderCurve: 'continuous'`); primary button height 50, radius 12; chips are capsules; inset-grouped lists; separators are hairlines; shadows nearly none (separate with background contrast).

**Components** (build once in `src/components/ui`, reuse everywhere): Screen, LargeTitleHeader, NavBar, TabBar (translucent on iOS, solid on Android), Button (filled / tinted / plain / destructive), TextField, SearchBar, SegmentedControl, Switch (iOS style), ListRow + InsetGroupedList, Chip, Badge, Avatar, ListingCard (2-column grid), PhotoGallery (swipe + pinch), BottomSheet (grabber), ActionSheet, Toast, Skeleton, EmptyState (text + simple icon, no illustration), PriceText, StatusPill, ChatBubble, OfflineBanner.

**Icons:** one consistent outline set (Ionicons or Lucide), 24 px. Flip directional icons in RTL. **No emoji as UI icons.**

**Motion:** 200–300 ms, spring defaults, light haptics on toggles/tab changes, respect Reduce Motion.

**Accessibility:** contrast AA, labels on icon-only buttons, dynamic type, correct reading order in RTL, never rely on color alone.

**Hard bans (these make an app look AI-generated):** purple/violet/indigo/neon-blue palettes · any gradient buttons or backgrounds (including red-white-green gradients) · large solid red or yellow areas · yellow text or thin yellow lines on white · the flag, its stripes or its sun emblem drawn in the UI · glow or colored shadows · glassmorphism cards (blur is allowed only on tab bar and nav bars) · emoji as icons · generic 3D/blob/AI illustrations · cards inside cards inside cards · heavy drop shadows · random corner radii · all-caps micro-labels with wide tracking · sparkle/magic-wand icons · marketing-style UI copy · lorem ipsum or fake testimonials (use realistic Arabic sample content).

**Design acceptance (M1):** build a preview of Home, Listing detail, a Sell step, Chat and Profile in Arabic and English, light and dark, with realistic mock data. Also show an unread badge, an error state, a warning banner and a destructive confirmation, so the owner sees every color role. The owner approves on the phone before any backend work. The owner may ask for more or less of any palette color; adjust within the color roles and keep the contrast test green, and record the change in `docs/DECISIONS.md`.

---

## 11. Milestones (each ends with an owner demo and approval; split into small steps)

**M0 · Environment and skeleton.** Check OS, Node >= 22.13, Git, VS Code, and an Android phone or emulator; guide installations in Arabic. **GitHub first (S26–S30), in small steps:** the owner's account security, an empty repository (public by the owner's decision, S26), sign-in from the terminal, and `.gitignore` as the very first commit (the first "تمام" uploads it to `main`); then work on the branch `m0-setup`. Create the Expo project (TypeScript strict, Expo Router, ESLint, Prettier, Jest, alias, `npm run check`, `.env.example`, folders, docs files), then the secret-scan hook and scripts, CI and Dependabot. Create the Supabase **dev** project (EU) with the owner and link the CLI. *Accept:* placeholder app runs on the owner's phone; `npm run check` and CI are green; every approved step is in the GitHub repository and nothing in it is secret or personal (S26); Claude Code **proves the secret gate works** by trying to commit a fake key (it is blocked, never pushed, then removed) and shows the owner the blocked message.

**M1 · Design system and shell (no backend).** Tokens, fonts, i18n (ar/fr/en) with RTL switching, UI primitives, 4-tab shell, preview screens with mock data, light/dark. *Accept:* owner approves the look (section 10).

**M2 · Database and security foundation.** Extensions, enums, tables, views, RLS, RPC skeletons, seed (Appendix A, locations: Syria, its 14 governorates and main cities; owner reviews), generated types, RLS tests, Supabase Advisors clean. *Accept:* all RLS tests pass.

**M3 · Auth and guest gating.** Dev build via EAS, Google + Facebook, profile trigger, secure session storage, login sheet with action resume, terms acceptance, sign-out. Owner tasks in section 13. *Accept:* real login works on the owner's phone; guests are blocked from protected actions.

**M4 · Browse and search.** Feed with keyset pagination, categories, Arabic-normalized search, filters, listing detail (gallery; approximate map placeholder), skeleton/empty/error states, EXPLAIN checks, performance budgets measured on a low-end phone.

**M5 · Create and manage listings.** Photo pipeline, location pickers, **map decision gate** (propose tile providers with costs; owner chooses), `create_listing` RPC with validation, approximate-location computation and quotas, edit, My listings, `formatPrice()`, prohibited-items notice.

**M6 · Lifecycle and jobs.** Mark sold, undo, expire, republish, deletion queue and worker, purge, orphan sweep, reminders, `job_runs`, tests that simulate time passing.

**M7 · Chat and notifications.** Conversations/messages with RLS, realtime on private channels, inbox, chat UI, unread counts, push tokens and push Edge Function, block, share pickup location, rate limits.

**M8 · Safety, privacy and compliance.** Report flow, blocks, keyword flagging, moderator RPCs (decide with the owner whether a small admin web page is needed), account deletion (in-app + public web URL), optional data export, legal pages hosting plan, force-update gate, maintenance mode, audit log.

**M9 · Hardening and performance.** Full review against section 8 including the self-attack session (S24), advisors, indexes, load test, accessibility pass, RTL/LTR/dark pass on every screen, Sentry, backup + restore test, bundle-size review, and a **reachability test from inside Syria without VPN** (Supabase API, Storage, Google and Facebook login, push, map tiles; the owner arranges a tester). If anything is blocked, propose a custom domain behind Cloudflare.

**M10 · Release (Android first).** Production Supabase project on a paid plan; production OAuth credentials; EAS production build (AAB); app icon and splash screen (section 10); store listing in ar/fr/en; privacy policy and terms URLs; Data Safety form; content rating; account-deletion URL; **closed testing** (verified: a personal developer account created after 2023-11-13 needs 12 testers opted in for 14 continuous days before production access; plan ~3 weeks; organization accounts are reportedly exempt, so confirm in Play Console help); staged rollout; post-launch monitoring. **iOS later:** Apple Developer account and **Sign in with Apple** (App Review 4.8: apps using Google/Facebook login for the primary account must offer an equivalent privacy-preserving option; re-read the current guideline before submitting), App Store Connect, review notes.

---

## 12. Testing

- **Unit:** formatters, Arabic normalizer, validators, services with mocked Supabase.
- **DB/RLS (pgTAP):** every table × role (guest, user A, user B, moderator) × operation, plus RPC quotas and lifecycle jobs.
- **Component tests** for ListingCard, forms and the login sheet.
- **E2E (Maestro):** guest browse → login prompt on "Message"; create listing; chat; mark sold; delete account.
- **Manual:** `docs/QA.md` checklist per milestone, written for the owner.
- CI must be green before merging.

---

## 13. Owner-only tasks (ask just-in-time, with click-by-click Arabic instructions)

Supabase account and projects (dev now, prod at M10) · GitHub account with two-factor authentication and the repository (public by the owner's decision; S26–S30; the owner signs in himself, S27) · Expo (EAS) account · Google Cloud OAuth clients (Web + Android with SHA-1) · Meta for Developers app for Facebook Login (App ID/secret, Android key hash, privacy-policy URL, data-deletion URL, switch to Live) · Google Play Console account (one-time fee) and identity verification · a domain or static hosting for legal pages · Sentry account · map tile provider account · final name, package ID and logo · lawyer review of Terms, Privacy Policy and the prohibited-items list · 12+ testers for Play closed testing · one tester inside Syria · Apple Developer account (later) · **MFA on all accounts**.

---

## Appendix A · Starter categories (data rows; owner can edit; French by Claude, needs review)

phones-tablets (هواتف وأجهزة لوحية) · computers (حواسيب وملحقاتها) · electronics (إلكترونيات: تلفاز، صوتيات، كاميرات) · home-appliances (أجهزة منزلية) · solar-power (طاقة شمسية وبطاريات) · furniture-home (أثاث ومستلزمات المنزل) · clothing (ملابس وأحذية وإكسسوارات) · kids-baby (مستلزمات الأطفال) · vehicles (سيارات ودراجات) · vehicle-parts (قطع غيار وإكسسوارات المركبات) · tools-equipment (عدد ومعدات) · sports-hobbies (رياضة وهوايات) · books-education (كتب وتعليم) · other (أخرى).

## Appendix B · Retention (starting values; document in the Privacy Policy)

| Data | Rule |
|---|---|
| Active listing | up to 90 days |
| Sold listing | hidden at once; photos deleted at once; row deleted after 14 days |
| Expired listing | hidden at once; photos and row deleted after 14 days (republish possible meanwhile) |
| Removed by moderators | hidden; photos deleted; row kept 90 days (appeals, evidence) |
| Conversations and messages | deleted 30 days after the related listing is purged, or after 90 days without activity; kept up to 180 days if tied to an open report |
| Reports | 180 days after resolution, then anonymized or deleted |
| Pending uploads / orphans | 24 hours |
| Account deletion | profile, listings, photos, push tokens deleted at once; the user's messages are anonymized as "deleted account" |
| Audit log | 1 year |

## Appendix C · Starting quotas (stored in private `app_config`, tune with real data)

New account (< 48 h): 3 listings/day, 10 new conversations/day, 100 uploads/day. Established account: 10 listings/day, 30 new conversations/day, 20 messages/minute, 20 reports/day. Edits and republishes count toward the listing quota.

## Appendix D · Prohibited items (proposal; a lawyer must review before launch)

Weapons, ammunition, explosives · illegal drugs and paraphernalia · prescription or controlled medicines · foreign-currency exchange and cash trading · antiquities and archaeological items · human organs or body parts · stolen goods · counterfeit goods or IP infringement · adult or sexual content · hazardous chemicals · personal documents, IDs, accounts or data · endangered wildlife products · gambling · services, jobs and real estate (out of scope for v1). Prohibited-keyword matches are **flagged for review**, not silently blocked.
