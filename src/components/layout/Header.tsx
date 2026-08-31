"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { CaretDown, List, MagnifyingGlass, X } from "@phosphor-icons/react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Logo from "./Logo";
import { primaryNav } from "@/data/site";
import type { NavCategory } from "./AppShell";

export default function Header({ categories }: { categories: NavCategory[] }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const primaryCategories = categories.filter((c) => c.inPrimaryNav);
  const moreCategories = categories.filter((c) => !c.inPrimaryNav);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
    setSearchOpen(false);
    setMoreOpen(false);
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

  useEffect(() => {
    if (!moreOpen) return;
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  function toggleSearch() {
    setOpen(false);
    setMoreOpen(false);
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

  const isCategoryActive = (slug: string) =>
    pathname.startsWith(`/category/${slug}`);
  const linkBase = "text-sm font-medium transition-colors hover:text-rust-600";

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-700/10 bg-beige-50/90 backdrop-blur">
      <Container className="flex h-18 items-center justify-between py-3 sm:h-20">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden items-center gap-6 lg:flex">
            {primaryNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${linkBase} ${
                    active ? "text-rust-600" : "text-charcoal-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {primaryCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`${linkBase} ${
                  isCategoryActive(category.slug)
                    ? "text-rust-600"
                    : "text-charcoal-600"
                }`}
              >
                {category.name}
              </Link>
            ))}

            {moreCategories.length > 0 ? (
              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen((v) => !v)}
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  className={`flex items-center gap-1 ${linkBase} ${
                    moreCategories.some((c) => isCategoryActive(c.slug))
                      ? "text-rust-600"
                      : "text-charcoal-600"
                  }`}
                >
                  More
                  <CaretDown
                    size={12}
                    weight="bold"
                    className={`transition-transform ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {moreOpen ? (
                  <div className="absolute right-0 top-full mt-3 min-w-52 overflow-hidden rounded-2xl border border-charcoal-700/10 bg-beige-50 py-2 shadow-lg shadow-charcoal-700/10">
                    {moreCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        className={`block px-4 py-2 text-sm font-medium transition-colors hover:bg-charcoal-700/5 hover:text-rust-600 ${
                          isCategoryActive(category.slug)
                            ? "text-rust-600"
                            : "text-charcoal-600"
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
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
                placeholder="Search by title, author, or blog number..."
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

            {categories.length > 0 ? (
              <p className="mt-3 px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
                Categories
              </p>
            ) : null}
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                  isCategoryActive(category.slug)
                    ? "bg-charcoal-700/5 text-rust-600"
                    : "text-charcoal-600 hover:bg-charcoal-700/5"
                }`}
              >
                {category.name}
              </Link>
            ))}

            <Button href="/contact" className="mt-3 w-full">
              Contact
            </Button>
          </Container>
        </div>
      </div>
    </header>
  );
}
