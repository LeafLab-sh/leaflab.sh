import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapURL: URL) => `\
# Cloudflare Managed content expected above

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(sitemapURL));
};
