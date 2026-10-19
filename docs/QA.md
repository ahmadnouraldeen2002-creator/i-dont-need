# Manual QA checklist

Written so the owner can follow it on a phone. Claude Code gives the same list in Arabic in each milestone report.

## M0 · Environment and skeleton

- [ ] Install **Expo Go** on the Android phone (a version that supports Expo SDK 57).
- [ ] Phone and computer on the same Wi-Fi.
- [ ] In a terminal in the project folder: `npx expo start`, then scan the QR code with Expo Go.
- [ ] The app opens on a white screen with **APP_NAME** in the middle, and no red error screen.
- [ ] `npm run check` ends with `Tests: ... passed` and no errors.
- [ ] `npm run secrets:scan:history` ends with `no leaks found`.
- [ ] On GitHub, every approved step has its tag (`step-0.1`, `step-0.2`, ...).
- [ ] CI is green on GitHub (after step 0.6).
- [ ] The secret gate blocks a fake key (demo at step 0.8).
