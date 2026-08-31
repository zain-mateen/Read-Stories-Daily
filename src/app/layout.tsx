import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import AppShell from "@/components/layout/AppShell";
import { SITE_URL } from "@/lib/siteUrl";
import { getNavCategories } from "@/data/categories";
import "./globals.css";

// Categories are read from the database on every request.
export const dynamic = "force-dynamic";

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

const description =
  "Read Stories Daily is a modern blog of real-life stories, mysteries, horror, and the strange-but-true — fresh reads every day.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Read Stories Daily — Real Stories, Mystery & More",
    template: "%s — Read Stories Daily",
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Read Stories Daily",
    url: SITE_URL,
    title: "Read Stories Daily — Real Stories, Mystery & More",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Read Stories Daily — Real Stories, Mystery & More",
    description,
  },
};

// Monetag's exact <script> tag (src + attributes) is issued per-account
// from your Monetag dashboard and varies by ad format, so it isn't
// hardcoded here — paste it into these two env vars instead. Nothing
// renders until both are set, so this is a no-op until you configure it.
// See DEPLOYMENT.md for the full walkthrough.
const monetagScriptSrc = process.env.NEXT_PUBLIC_MONETAG_SCRIPT_SRC;
const monetagZoneId = process.env.NEXT_PUBLIC_MONETAG_ZONE_ID;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = (await getNavCategories()).map((c) => ({
    slug: c.slug,
    name: c.name,
    inPrimaryNav: c.inPrimaryNav,
  }));

  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <head>
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="274324"
          async
          data-cfasync="false"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-beige-50 text-charcoal-700">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3C8SS4ELCH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3C8SS4ELCH');
          `}
        </Script>

        <AppShell categories={categories}>{children}</AppShell>

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
