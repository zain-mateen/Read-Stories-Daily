export const site = {
  name: "Read Stories Daily",
  shortName: "Read Stories",
  tagline: "Daily",
  description:
    "Real-life stories, mysteries, and the strange-but-true — worth reading, every day.",
  heroImage: "https://picsum.photos/seed/rsd-hero-banner/2000/1200",
  email: "contact@readstoriesdaily.com",
  // Social profiles are not live yet. Kept here (and commented out in the
  // footer) so they can be switched back on without rewriting anything.
  social: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
  },
};

// Fixed nav entries. Category links are pulled live from the database and
// added after these by the header.
export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
];

export const footerPages = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
];
