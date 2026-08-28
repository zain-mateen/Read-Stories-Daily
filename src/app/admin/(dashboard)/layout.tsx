import type { Metadata } from "next";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-beige-50 text-charcoal-700">
      <header className="border-b border-charcoal-700/10 bg-beige-100/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/admin/posts"
            className="font-display text-lg font-semibold text-charcoal-800"
          >
            Read Stories Daily <span className="text-rust-600">Admin</span>
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal-500 transition-colors hover:text-rust-600"
            >
              View site ↗
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
