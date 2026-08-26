import Image from "next/image";
import { ArrowRight, BookOpen, MagnifyingGlass } from "@phosphor-icons/react/ssr";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { categories } from "@/data/categories";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[560px] items-end overflow-hidden border-b border-charcoal-700/10 sm:min-h-[640px] lg:min-h-[720px]">
      <Image
        src={site.heroImage}
        alt="A quiet, sunlit moment — the feeling behind every Read Stories Daily story"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/55 to-charcoal-900/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/40 via-transparent to-transparent" />

      <Container className="relative w-full pb-14 pt-28 sm:pb-16 lg:pb-20">
        <span className="mb-5 flex w-fit items-center gap-2 rounded-full border border-beige-50/25 bg-beige-50/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-beige-100 backdrop-blur-sm">
          <BookOpen size={15} weight="bold" className="text-rust-400" />
          Stories worth your morning coffee
        </span>

        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-beige-50 sm:text-5xl lg:text-[3.5rem]">
          Slow down. Read something{" "}
          <span className="text-rust-400">worth remembering.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-beige-100/85 sm:text-lg">
          Read Stories Daily is a small, independent blog about travel,
          lifestyle, culture, and wellness — honest writing, no clickbait,
          published for people who still like to read.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button href="/blog" variant="inverse" size="md">
            Start Reading
            <ArrowRight size={17} weight="bold" />
          </Button>
          <Button href="/search" variant="inverse-outline" size="md">
            <MagnifyingGlass size={17} weight="bold" />
            Search Stories
          </Button>
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-2.5">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-beige-50/20 bg-beige-50/5 px-3.5 py-1.5 text-xs font-medium text-beige-100/90 backdrop-blur-sm transition-colors hover:border-rust-400/60 hover:bg-beige-50/15 hover:text-beige-50"
            >
              <category.icon size={13} />
              {category.name}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
