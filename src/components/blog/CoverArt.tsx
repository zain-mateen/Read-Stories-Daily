import Image from "next/image";
import { getCategoryBySlug } from "@/data/categories";

export default function CoverArt({
  image,
  alt,
  category,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  image: string;
  alt: string;
  category: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const categoryData = getCategoryBySlug(category);
  const Icon = categoryData?.icon;

  return (
    <div className={`relative overflow-hidden bg-charcoal-700 ${className}`}>
      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/0 to-charcoal-900/10" />
      {categoryData ? (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-beige-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-700 shadow-sm backdrop-blur-sm">
          {Icon ? <Icon size={13} weight="bold" className="text-rust-500" /> : null}
          {categoryData.name}
        </span>
      ) : null}
    </div>
  );
}
