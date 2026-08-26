import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarBlank, Clock } from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import BlogCard from "@/components/blog/BlogCard";
import CoverArt from "@/components/blog/CoverArt";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  type PostBlock,
} from "@/data/posts";
import { getCategoryBySlug } from "@/data/categories";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ContentBlock({ block }: { block: PostBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="mt-10 mb-3 font-display text-2xl font-semibold text-charcoal-800">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote className="my-8 border-l-4 border-rust-400 bg-beige-100/70 py-4 pl-6 pr-4 font-display text-xl italic leading-snug text-charcoal-700">
          &ldquo;{block.text}&rdquo;
        </blockquote>
      );
    default:
      return (
        <p className="mb-5 text-base leading-relaxed text-charcoal-500 sm:text-lg">
          {block.text}
        </p>
      );
  }
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage(
  props: PageProps<"/blog/[slug]">
) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategoryBySlug(post.category);
  const related = getRelatedPosts(post, 3);

  return (
    <article>
      <Container className="pt-8 sm:pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-400 transition-colors hover:text-rust-600"
        >
          <ArrowLeft size={15} weight="bold" />
          Back to all posts
        </Link>

        <div className="mt-6 max-w-3xl">
          {category ? (
            <Link
              href={`/category/${category.slug}`}
              className="w-fit rounded-full bg-charcoal-700/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rust-600"
            >
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-charcoal-800 sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-charcoal-400">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-charcoal-700/10 py-4 text-sm text-charcoal-400">
            <span className="flex items-center gap-2.5">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 rounded-full object-cover"
              />
              <span>
                <span className="block font-semibold text-charcoal-700">
                  {post.author.name}
                </span>
                <span className="block text-xs">{post.author.role}</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarBlank size={15} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {post.readTime}
            </span>
          </div>
        </div>

        <CoverArt
          image={post.image}
          alt={post.title}
          category={post.category}
          priority
          className="mt-8 aspect-[16/8] w-full rounded-3xl sm:mt-10"
        />

        <div className="mx-auto max-w-3xl py-10 sm:py-12">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}

          <div className="mt-10 flex items-center gap-4 rounded-2xl border border-charcoal-700/10 bg-beige-100/60 p-6">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-full object-cover"
            />
            <div>
              <p className="font-display text-base font-semibold text-charcoal-800">
                {post.author.name}
              </p>
              <p className="text-sm text-charcoal-400">{post.author.role}</p>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <Container>
          <div className="border-t border-charcoal-700/10 py-14 sm:py-16">
            <SectionHeading
              eyebrow="Keep Reading"
              title={category ? `More in ${category.name}` : "Related Stories"}
              viewMoreHref={category ? `/category/${category.slug}` : "/blog"}
            />
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </Container>
      ) : null}
    </article>
  );
}
