# Runbook

What to do when something goes wrong (CLAUDE.md S25). This repository is public: no secrets, no personal contact details and no account-security status in this file (S26).

Repository: https://github.com/ahmadnouraldeen2002-creator/i-dont-need

## A secret was committed or pushed (S28)

1. Treat it as leaked, even if it was never pushed. On a public repository, assume it was copied within minutes.
2. **Revoke or rotate it first**, at the service that issued it (see "Revoke keys and tokens").
3. Tell the owner.
4. Only then, with the owner's approval, remove it from the git history (GitHub docs: "Removing sensitive data from a repository"). Removing it from history does not make the old value safe again.
5. If the secret appeared in a GitHub Actions log (public on this repository): delete the log, then rotate the secret (S30).

## Revoke keys and tokens

- **GitHub CLI sign-in on the owner's computer:** https://github.com/settings/applications → Authorized OAuth Apps → GitHub CLI → Revoke. Then sign in again with `gh auth login --web --git-protocol https`.
- **GitHub personal access tokens:** https://github.com/settings/tokens → delete the token; create a new one only if needed (S27).
- **Supabase keys:** added when the Supabase project exists (step 0.7).
- **Other services (Expo, Google, Meta, Sentry, map provider):** added when each account is created.

## Check or change GitHub security settings

How to check them; their status is never written here (S26).

- Two-factor authentication: https://github.com/settings/security
- Email privacy ("Keep my email addresses private", "Block command line pushes that expose my email"): https://github.com/settings/emails
- Branch protection, ruleset `protect-main` (S29): https://github.com/ahmadnouraldeen2002-creator/i-dont-need/settings/rules
- Secret scanning, push protection and Dependabot alerts: https://github.com/ahmadnouraldeen2002-creator/i-dont-need/settings/security_analysis
- Approval for workflows from outside contributors (S30): https://github.com/ahmadnouraldeen2002-creator/i-dont-need/settings/actions

## Disable sign-ups, maintenance mode, restore a backup

Written when these exist: disabling sign-ups (M3), maintenance mode (S21, M8), backup restore (S19, M9).

## Contacts

- GitHub Support: https://support.github.com
- Supabase support: added at step 0.7.
- Owner: through the owner's own accounts (no personal contact details in this public file).
