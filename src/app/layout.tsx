import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import SmoothScrollProvider from "@/components/layout/SmoothScrollProvider";
import PageTransition from "@/components/layout/PageTransition";
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
  title: {
    default: "Read Stories Daily — Travel, Lifestyle & Culture Blog",
    template: "%s — Read Stories Daily",
  },
  description:
    "Read Stories Daily is a modern blog covering travel, lifestyle, culture, and wellness — fresh stories worth reading, every day.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-beige-50 text-charcoal-700">
        <SmoothScrollProvider>
          <ScrollToTop />
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
