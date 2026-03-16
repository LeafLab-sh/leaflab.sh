// src/content/site.ts
export type JsonLd = Record<string, any>;

export type SiteNavItem = {
  label: string;
  href: string;
};

export type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
  author: {
    name: string;
    email?: string;
    url?: string;
    socials?: {
      x?: string;
      github?: string;
      linkedin?: string;
    };
  };
  nav: SiteNavItem[];
  seo: {
    ogImage?: string;
    ogImageAlt?: string;
    robots: string;
    themeColor: string;
  };
};

export const site: SiteConfig = {
  name: "LeafLab",
  tagline:
    "LeafLab.sh — software development and consulting for small businesses.",
  description:
    "Astro Baseline is a minimal HTML-first starter with senior defaults: SEO, JSON-LD, a11y basics, and clean structure.",
  url:
    import.meta.env.SITE_URL ??
    "https://leaflab-website-dev.leaflab.workers.dev",
  locale: "en",
  author: {
    name: "Lea Fairbanks",
    email: "hello@leaflab.sh",
    url: "https://leaflab.sh",
    socials: {
      github: "https://github.com/darunada",
      linkedin: "https://www.linkedin.com/in/lrfairbanks",
    },
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
  seo: {
    ogImage: "/images/og/og-default.jpg",
    ogImageAlt:
      "LeafLab offers development and consulting services to small businesses.",
    robots: "index,follow",
    themeColor: "#fbfbf9",
  },
};
