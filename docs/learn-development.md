# Learning stays local

Bhajan Learn is unfinished and available only through `npm run dev` at `/learn`.
The shared `LEARN_ENABLED` flag in `src/lib/features.ts` hides Learn from desktop
and mobile navigation in production. `src/app/learn/layout.tsx` also blocks the
entire learning route tree with `notFound()`, including direct lesson links.

`npm run build` / `npm start` and hosted deployments keep Learn unavailable.
No hosting environment variables are needed. The code, assets, and local lesson
progress remain available for continued development.

When Learn is ready to launch, change the shared flag and verify the production
navigation and lesson routes before deploying.
