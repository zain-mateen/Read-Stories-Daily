import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
      // Posts are now managed through the admin panel, and images are
      // supplied as arbitrary URLs (pasted from any host). Widening the
      // pattern lets next/image optimize those without editing this file
      // for every new source. Tighten this back down to specific hostnames
      // if you'd rather keep an explicit allowlist.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
