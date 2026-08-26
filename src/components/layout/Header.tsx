"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Logo from "./Logo";
import { primaryNav } from "@/data/site";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function toggleSearch() {
    setOpen(false);
    setSearchOpen((v) => !v);
  }

  function toggleNav() {
    setSearchOpen(false);
    setOpen((v) => !v);
  }

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700/10 bg-beige-50/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between py-3 sm:h-20">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden items-center gap-7 lg:flex">
            {primaryNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-rust-600 ${
                    active ? "text-rust-600" : "text-charcoal-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden h-6 w-px bg-charcoal-700/10 lg:block" />

          <button
            type="button"
            onClick={toggleSearch}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors ${
              searchOpen
                ? "bg-charcoal-700 text-beige-50"
                : "text-charcoal-700 hover:bg-charcoal-700/5"
            }`}
          >
            {searchOpen ? <X size={20} /> : <MagnifyingGlass size={20} />}
          </button>

          <div className="hidden lg:block">
            <Button href="/contact" size="sm">
              Contact
            </Button>
          </div>

          <button
            type="button"
            onClick={toggleNav}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-charcoal-700 transition-colors hover:bg-charcoal-700/5 lg:hidden"
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </Container>

      <div
        className={`grid overflow-hidden border-t border-charcoal-700/10 bg-beige-100/60 transition-[grid-template-rows] duration-300 ease-out ${
          searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <div className="min-h-0">
          <Container className="py-4">
            <form
              onSubmit={handleSearchSubmit}
              className="relative mx-auto max-w-xl"
            >
              <MagnifyingGlass
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stories by title, topic, or author..."
                className="w-full rounded-full border border-charcoal-700/15 bg-beige-50 py-3 pl-11 pr-4 text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20"
              />
            </form>
          </Container>
        </div>
      </div>

      <div
        className={`grid overflow-hidden border-t border-charcoal-700/10 bg-beige-50 transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
        }`}
      >
        <div className="min-h-0">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    active
                      ? "bg-charcoal-700/5 text-rust-600"
                      : "text-charcoal-600 hover:bg-charcoal-700/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button href="/contact" className="mt-3 w-full">
              Contact
            </Button>
          </Container>
        </div>
      </div>
    </header>
  );
}
