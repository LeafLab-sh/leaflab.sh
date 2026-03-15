// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site:
    process.env.SITE_URL ?? "https://leaflab-website-dev.leaflab.workers.dev",

  adapter: cloudflare({
    imageService: "compile",
  }),

  integrations: [sitemap(), partytown()],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      CLOUDFLARE_ACCESS_DOMAIN: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      CLOUDFLARE_ACCESS_AUD: envField.string({
        context: "server",
        access: "secret",
        optional: true,
      }),
      LOG_LEVEL: envField.string({
        context: "server",
        access: "public",
        default: "INFO",
      }),
    },
  },

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Source Code Pro",
      cssVariable: "--font-source-code-pro",
    },
  ],
});
