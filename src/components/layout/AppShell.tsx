"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import SmoothScrollProvider from "./SmoothScrollProvider";
import PageTransition from "./PageTransition";

export type NavCategory = {
  slug: string;
  name: string;
  inPrimaryNav: boolean;
};

/**
 * The admin panel (/admin) is a utility dashboard, not part of the public
 * site — it gets a blank canvas instead of the marketing Header/Footer,
 * Lenis smooth scroll, or page-fade transitions. Everything else renders
 * exactly as before. Keeping this decision here (instead of inside
 * Header/Footer/etc.) means none of those components needed to change.
 */
export default function AppShell({
  children,
  categories,
}: {
  children: ReactNode;
  categories: NavCategory[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <ScrollToTop />
        {children}
      </>
    );
  }

  return (
    <SmoothScrollProvider>
      <ScrollToTop />
      <Header categories={categories} />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer categories={categories} />
    </SmoothScrollProvider>
  );
}
