# Performance measurements

Budgets are in CLAUDE.md section 9. Record every measurement with its date, device, build type and app version.

| Date       | What                                                    | Result | How                                  |
| ---------- | ------------------------------------------------------- | ------ | ------------------------------------ |
| 2026-10-19 | Android JS bundle, M0 placeholder app (Hermes bytecode) | 2.7 MB | `npx expo export --platform android` |

The first real budgets (cold start, scrolling fps, first-screen payload) are measured at M4 on a low-end Android phone.
