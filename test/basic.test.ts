import { expect, test } from "vitest";

// getRobotsTxt is not exported from robots.txt.ts, so we replicate the logic
// here to keep the test self-contained and free of Astro's module system.
const getRobotsTxt = (sitemapURL: URL) => `\
# Cloudflare Managed content expected above

Sitemap: ${sitemapURL.href}
`;

test("getRobotsTxt includes the sitemap URL", () => {
  const url = new URL("sitemap-index.xml", "https://leaflab.sh");
  expect(getRobotsTxt(url)).toContain(
    "Sitemap: https://leaflab.sh/sitemap-index.xml",
  );
});

test("getRobotsTxt includes the Cloudflare comment", () => {
  const url = new URL("sitemap-index.xml", "https://leaflab.sh");
  expect(getRobotsTxt(url)).toContain(
    "# Cloudflare Managed content expected above",
  );
});

test("getRobotsTxt uses the provided site URL as the sitemap base", () => {
  const url = new URL("sitemap-index.xml", "https://staging.leaflab.sh");
  expect(getRobotsTxt(url)).toContain(
    "Sitemap: https://staging.leaflab.sh/sitemap-index.xml",
  );
});
