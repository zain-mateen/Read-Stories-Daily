import Image from "next/image";

export default function CoverArt({
  image,
  alt,
  categoryLabel,
  blogNumber,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  image: string;
  alt: string;
  categoryLabel?: string;
  blogNumber?: number | null;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
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
      {categoryLabel ? (
        <span className="absolute left-3 top-3 rounded-full bg-beige-50/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-charcoal-700 shadow-sm backdrop-blur-sm">
          {categoryLabel}
        </span>
      ) : null}
      {blogNumber != null ? (
        <span className="absolute right-3 top-3 rounded-full bg-charcoal-900/80 px-3 py-1.5 text-xs font-semibold tabular-nums text-beige-50 shadow-sm backdrop-blur-sm">
          #{blogNumber}
        </span>
      ) : null}
    </div>
  );
}
