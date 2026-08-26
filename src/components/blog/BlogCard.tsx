import Image from "next/image";
import Link from "next/link";
import { Clock } from "@phosphor-icons/react/ssr";
import type { Post } from "@/data/posts";
import CoverArt from "./CoverArt";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal-700/10 bg-beige-100/60 transition-all duration-300 hover:-translate-y-1 hover:border-charcoal-700/20 hover:shadow-lg hover:shadow-charcoal-700/5"
    >
      <CoverArt
        image={post.image}
        alt={post.title}
        category={post.category}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-charcoal-800 transition-colors group-hover:text-rust-600 sm:text-xl">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-charcoal-400">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2.5 pt-2 text-xs text-charcoal-300">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 rounded-full object-cover"
          />
          <span className="font-medium text-charcoal-500">
            {post.author.name}
          </span>
          <span aria-hidden className="text-charcoal-200">
            &middot;
          </span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden className="text-charcoal-200">
            &middot;
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
