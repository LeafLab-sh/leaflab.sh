# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (localhost:5173)
pnpm build        # tsc -b && vite build
pnpm lint         # ESLint
pnpm check        # Full check: tsc + vite build + wrangler dry-run deploy
pnpm deploy       # Deploy to Cloudflare Workers
pnpm cf-typegen   # Regenerate Cloudflare Worker type bindings (worker-configuration.d.ts)
npx wrangler tail # Stream live Worker logs
```

No test framework is configured.

## Architecture

This is a full-stack app split into two distinct environments:

- **`src/worker/index.ts`** — Hono app running as a Cloudflare Worker. Handles API routes (e.g. `/api/*`). The Worker is the deployment entry point (`main` in `wrangler.json`).
- **`src/frontend/`** — React SPA built by Vite. Static output lands in `dist/client/`, which is served by Cloudflare Workers Assets with SPA fallback (all unmatched routes return `index.html`).

The `@cloudflare/vite-plugin` wires both together: in dev, Vite proxies Worker routes to a local miniflare instance; in production, `vite build` produces both `dist/client/` (frontend) and `dist/my_hono_app/` (Worker bundle).

Worker bindings are typed via the generated `Env` interface — run `pnpm cf-typegen` after modifying `wrangler.json` bindings. The Hono app is typed as `new Hono<{ Bindings: Env }>()`.

`tsconfig.app.json` covers `src/frontend/` only (strict mode, `noEmit`). The worker is compiled by Wrangler/Vite directly.
