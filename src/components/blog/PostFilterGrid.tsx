"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react";
import type { Post } from "@/data/posts";
import BlogCard from "./BlogCard";

type CategoryOption = { slug: string; name: string };

export default function PostFilterGrid({
  posts,
  categories,
  showSearch = false,
  initialQuery = "",
  initialCategory = "all",
}: {
  posts: Post[];
  categories: CategoryOption[];
  showSearch?: boolean;
  initialQuery?: string;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const numericQuery = /^\d+$/.test(q) ? Number(q) : null;
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "all" || post.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      if (numericQuery !== null && post.blogNumber === numericQuery) return true;
      return (
        post.title.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.categoryName.toLowerCase().includes(q) ||
        (post.excerpt ?? "").toLowerCase().includes(q)
      );
    });
  }, [posts, query, activeCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: posts.length };
    for (const category of categories) {
      map[category.slug] = posts.filter(
        (post) => post.category === category.slug
      ).length;
    }
    return map;
  }, [posts, categories]);

  return (
    <div>
      {showSearch ? (
        <div className="relative mb-6">
          <MagnifyingGlass
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-300"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, or blog number..."
            className="w-full rounded-full border border-charcoal-700/15 bg-beige-50 py-3.5 pl-11 pr-11 text-sm text-charcoal-700 placeholder:text-charcoal-300 transition-colors focus:border-rust-400 focus:outline-none focus:ring-2 focus:ring-rust-400/20 sm:text-base"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-charcoal-300 transition-colors hover:text-rust-500"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2.5">
        <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-300">
          <SlidersHorizontal size={14} />
          Filter
        </span>
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-charcoal-700 text-beige-50"
              : "border border-charcoal-700/15 bg-beige-50 text-charcoal-600 hover:border-rust-400 hover:text-rust-600"
          }`}
        >
          All Stories
          <span className="ml-1.5 opacity-60">{counts.all}</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveCategory(category.slug)}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category.slug
                ? "bg-charcoal-700 text-beige-50"
                : "border border-charcoal-700/15 bg-beige-50 text-charcoal-600 hover:border-rust-400 hover:text-rust-600"
            }`}
          >
            {category.name}
            <span className="ml-0.5 opacity-60">
              {counts[category.slug] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <MagnifyingGlass size={28} className="text-charcoal-300" />
          <p className="font-display text-lg font-semibold text-charcoal-700">
            No stories found
          </p>
          <p className="max-w-sm text-sm text-charcoal-400">
            Try a different search term or clear the category filter.
          </p>
        </div>
      )}
    </div>
  );
}
