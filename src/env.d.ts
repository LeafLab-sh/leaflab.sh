/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    logger: import("./utils/logger").Logger;
  }
}

interface ImportMetaEnv {
  readonly CLOUDFLARE_ACCESS_DOMAIN: string;
  readonly CLOUDFLARE_ACCESS_AUD: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
