# leaflab.sh website

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

The source for [leaflab.sh](https://leaflab.sh) — Lea Fairbanks's software development and consulting practice. Built with Astro, deployed to Cloudflare Workers at the edge.

## About

This is a server-side rendered Astro site using the `@astrojs/cloudflare` adapter. It runs as a Cloudflare Worker, which means no servers to manage, global distribution out of the box, and access to the full Cloudflare developer platform (KV, D1, R2, etc.) when the site needs to do more than serve pages.

The build splits into two artifacts:

- `dist/client/` — static assets served via the `ASSETS` binding
- `dist/server/` — Worker code that handles dynamic requests

Wrangler wires them together. In production, all traffic hits the Worker; static assets get short-circuited to the edge cache via `ASSETS`.

## Project Structure

```
src/
├── pages/              # File-based routes (.astro → URL path)
│   └── robots.txt.ts   # Dynamic robots.txt endpoint (links to sitemap)
├── layouts/            # HTML shell templates
├── components/         # Reusable Astro components
└── env.d.ts            # Extends App.Locals with Cloudflare Runtime bindings
public/
│   └── .well-known/
│       └── security.txt  # Generated via https://securitytxt.org/
wrangler.jsonc        # Cloudflare Worker config (routes, bindings, compatibility flags)
astro.config.mjs # Astro config (adapter, integrations, platform proxy)
```

## Getting Started

You'll need bun.

```bash
bun install
bun run dev     # Dev server at localhost:4321
```

`bun run dev` uses Astro's platform proxy to simulate the Cloudflare runtime locally. Wrangler bindings (KV, D1, etc.) declared in `wrangler.jsonc` are available in the dev server — no deploy required to test them.

## Commands

| Command              | What it does                                                   |
| :------------------- | :------------------------------------------------------------- |
| `bun run dev`        | Start the dev server at `localhost:4321`                       |
| `bun run build`      | Build to `./dist/`                                             |
| `bun run preview`    | Build + run locally via Wrangler (closer to production parity) |
| `bun run deploy`     | Build + deploy to Cloudflare                                   |
| `bun run cf-typegen` | Regenerate `worker-configuration.d.ts` from `wrangler.jsonc`   |

Use `bun run preview` when you want to verify the Worker behavior before deploying — it runs the actual Wrangler dev server against the compiled output, not the Astro dev server.

## Astro Integrations

Three integrations are active in `astro.config.mjs`:

- **`@astrojs/cloudflare`** — compiles Astro SSR output to run as a Cloudflare Worker
- **`@astrojs/sitemap`** — auto-generates `/sitemap-index.xml` at build time; linked from `Layout.astro` and referenced in `robots.txt`
- **`@astrojs/partytown`** — offloads third-party scripts (analytics, tag managers) to a web worker to keep the main thread free. Tag any third-party `<script>` with `type="text/partytown"` to opt it in.

The sitemap and `robots.txt` both depend on the `site` URL. It's set via the `SITE_URL` environment variable, falling back to `https://leaflab.sh`:

```bash
# Override for staging/preview builds
SITE_URL=https://staging.leaflab.sh bun run build
```

## Cloudflare Workers

The site deploys to `leaflab.sh` as a custom domain Worker. Worker configuration lives in `wrangler.jsonc`.

**Bindings** (KV namespaces, D1 databases, R2 buckets, etc.) are declared in `wrangler.jsonc` and accessed at runtime via:

```ts
// In .astro files
const { env } = Astro.locals.runtime;

// In API endpoints (src/pages/api/*)
const { env } = context.locals.runtime;
```

When you add a new binding, run `bun run cf-typegen` to regenerate `worker-configuration.d.ts` so the types stay in sync.

**Compatibility flags** in use:

- `nodejs_compat` — enables Node.js APIs in the Worker runtime
- `global_fetch_strictly_public` — prevents `fetch()` from accessing private network addresses

**Observability** is enabled. Worker logs and metrics are available in the Cloudflare dashboard under Workers & Pages → leaflab-website → Observability.

## Secrets and Environment Variables

Non-sensitive config goes in `wrangler.jsonc` under `vars`. Sensitive values (API keys, tokens) should be set as Worker secrets:

```bash
wrangler secret put MY_SECRET
```

Secrets are not stored in the repo. Document what's required in this README when you add one.

## Troubleshooting

**`bun run dev` doesn't reflect Cloudflare bindings**

Platform proxy is enabled in `astro.config.mjs`, so bindings declared in `wrangler.jsonc` should work in dev. If a binding isn't resolving, make sure it exists in `wrangler.jsonc` and that you've run `bun run cf-typegen` to update the types.

**Types for `Astro.locals.runtime.env` are missing or wrong**

Run `bun run cf-typegen`. This regenerates `worker-configuration.d.ts` from your current `wrangler.jsonc`. You'll need to do this any time you add or change a binding.

**`bun run preview` fails with a Wrangler error**

Make sure `bun run build` succeeded first — `preview` runs `astro build && wrangler dev` and will fail fast if the build output is missing or stale. Check `dist/` exists and looks right before debugging Wrangler.

**Deployment fails**

Run `bun run build` locally and confirm the output is clean before deploying. If the build passes but `wrangler deploy` errors, check that your Cloudflare account has the Worker and any required bindings (KV namespaces, D1 databases, etc.) already created — Wrangler won't create them for you on deploy.

**Unexpected behavior in production that doesn't reproduce locally**

Use `bun run preview` instead of `bun run dev` to test. The Astro dev server and the Wrangler dev server behave differently in subtle ways. If it works in `dev` but breaks in `preview`, the issue is likely Worker-specific (binding access, compatibility flags, module resolution).

## Claude Code

If you're using Claude Code, a LeafLab brand voice skill is bundled at `.claude/skills/leaflab-branding.skill`. Install it once to get voice and tone loaded automatically when writing content for the site:

```bash
claude skill install .claude/skills/leaflab-branding.skill
```

A `/leaflab-branding` slash command is also available without installation.
