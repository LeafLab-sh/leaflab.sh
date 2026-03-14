// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

import partytown from "@astrojs/partytown";

import tailwindcss from "@tailwindcss/vite";

import { shield } from "@kindspells/astro-shield";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://leaflab.sh",

  adapter: cloudflare({
    imageService: "compile",
  }),

  integrations: [sitemap(), partytown(), shield({})],

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
