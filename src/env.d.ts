/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    logger: import("./utils/logger").Logger;
  }
}

interface ImportMetaEnv {
  readonly CLOUDFLARE_ACCESS_DOMAIN: string;
  readonly CLOUDFLARE_ACCESS_AUD: string;
  readonly CLOUDFLARE_ANALYTICS_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
