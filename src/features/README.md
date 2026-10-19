# Features

One folder per feature (`auth`, `listings`, `search`, `chat`, `profile`, `reports`, `notifications`, `locations`), created when the feature is built.

Each feature has `screens/`, `components/`, `hooks/`, `services/` (the only place that calls Supabase), `schemas/` (Zod), `__tests__/` and an `index.ts` public API. Other code imports a feature only through its `index.ts` (CLAUDE.md section 4).
