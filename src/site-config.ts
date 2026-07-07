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
    "LeafLab — real full-stack development for businesses that are actually going somewhere.",
  description:
    "LeafLab is a network of software developers and consultants. Full-stack, scalable, and built by people who don't get blocked.",
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
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  seo: {
    ogImage: "/images/og/og-default.jpg",
    ogImageAlt:
      "LeafLab — real full-stack development for businesses that are actually going somewhere.",
    robots: "index,follow",
    themeColor: "#fbfbf9",
  },
};
