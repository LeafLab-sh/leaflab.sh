// @ts-check
import { defineConfig, fontProviders } from "astro/config";

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

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Source Code Pro",
      cssVariable: "--font-source-code-pro",
    },
  ],
});
