import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: {
    default: "Read Stories Daily — Travel, Lifestyle & Culture Blog",
    template: "%s — Read Stories Daily",
  },
  description:
    "Read Stories Daily is a modern blog covering travel, lifestyle, culture, and wellness — fresh stories worth reading, every day.",
};

// Monetag's exact <script> tag (src + attributes) is issued per-account
// from your Monetag dashboard and varies by ad format, so it isn't
// hardcoded here — paste it into these two env vars instead. Nothing
// renders until both are set, so this is a no-op until you configure it.
// See DEPLOYMENT.md for the full walkthrough.
const monetagScriptSrc = process.env.NEXT_PUBLIC_MONETAG_SCRIPT_SRC;
const monetagZoneId = process.env.NEXT_PUBLIC_MONETAG_ZONE_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-beige-50 text-charcoal-700">
        <AppShell>{children}</AppShell>
        {monetagScriptSrc ? (
          <Script
            id="monetag"
            src={monetagScriptSrc}
            data-zone={monetagZoneId}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
