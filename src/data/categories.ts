import type { Icon } from "@phosphor-icons/react";
import { Airplane, ForkKnife, Leaf, Sparkle } from "@phosphor-icons/react/ssr";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: Icon;
  image: string;
};

export const categories: Category[] = [
  {
    slug: "travel",
    name: "Travel",
    description:
      "Destinations, itineraries, and the small moments worth chasing in between.",
    icon: Airplane,
    image: "https://picsum.photos/seed/rsd-category-travel/1600/700",
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    description:
      "Everyday rituals, considered style, and the art of living with intention.",
    icon: Sparkle,
    image: "https://picsum.photos/seed/rsd-category-lifestyle/1600/700",
  },
  {
    slug: "culture",
    name: "Food & Culture",
    description:
      "Recipes, traditions, and the stories behind the tables we gather at.",
    icon: ForkKnife,
    image: "https://picsum.photos/seed/rsd-category-culture/1600/700",
  },
  {
    slug: "wellness",
    name: "Wellness",
    description:
      "Mind, body, and the quiet practices that make room for a slower pace.",
    icon: Leaf,
    image: "https://picsum.photos/seed/rsd-category-wellness/1600/700",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
