import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Star } from "@phosphor-icons/react/ssr";
import type { Post } from "@/data/posts";
import { postPreview } from "@/lib/postText";

export default function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-charcoal-700/10 bg-beige-100/60 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-charcoal-700/5 lg:grid-cols-2"
    >
      <div className="relative aspect-[16/11] w-full overflow-hidden lg:aspect-auto">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-beige-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-700 shadow-sm backdrop-blur-sm">
          {post.categoryName}
        </span>
      </div>

      <div className="flex flex-col justify-center gap-4 p-8 sm:p-10 lg:p-12">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-rust-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rust-600">
          <Star size={13} weight="fill" />
          Featured Story
        </span>
        <h2 className="font-display text-2xl font-semibold leading-tight text-charcoal-800 transition-colors group-hover:text-rust-600 sm:text-3xl lg:text-[2.25rem]">
          {post.title}
        </h2>
        <p className="line-clamp-3 max-w-md text-base leading-relaxed text-charcoal-400">
          {postPreview(post)}
        </p>
        <div className="flex items-center gap-3 text-sm text-charcoal-300">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
          />
          <span className="font-medium text-charcoal-500">
            {post.author.name}
          </span>
          <span aria-hidden className="text-charcoal-200">
            &middot;
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {post.readTime}
          </span>
        </div>
        <span className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-charcoal-700">
          Read the story
          <ArrowRight
            size={15}
            weight="bold"
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
