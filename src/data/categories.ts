import { query, execute, readQuery } from "@/lib/db";
import { slugify } from "@/lib/slugify";

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  inPrimaryNav: boolean;
};

type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  description: string;
  sort_order: number;
  in_primary_nav: number;
};

function mapRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
    inPrimaryNav: !!row.in_primary_nav,
  };
}

const ORDER = "ORDER BY sort_order ASC, name ASC";

/**
 * The seeded categories, used as a fallback so the site shell (header,
 * footer) still renders if the database is briefly unreachable.
 */
export const FALLBACK_CATEGORIES: Category[] = [
  ["true-stories", "True Stories", 1, true],
  ["mystery-suspense", "Mystery & Suspense", 2, true],
  ["horror-stories", "Horror Stories", 3, true],
  ["emotional-stories", "Emotional Stories", 10, false],
  ["inspirational-stories", "Inspirational Stories", 11, false],
  ["love-stories", "Love Stories", 12, false],
  ["animal-stories", "Animal Stories", 13, false],
  ["strange-unbelievable", "Strange & Unbelievable", 14, false],
].map(([slug, name, sortOrder, inPrimaryNav], i) => ({
  id: -1 - i,
  slug: slug as string,
  name: name as string,
  description: "",
  sortOrder: sortOrder as number,
  inPrimaryNav: inPrimaryNav as boolean,
}));

export async function getAllCategories(): Promise<Category[]> {
  const rows = await readQuery<CategoryRow>(
    [],
    `SELECT * FROM categories ${ORDER}`
  );
  return rows.map(mapRow);
}

/**
 * Like `getAllCategories`, but always returns something usable — the seeded
 * list if the DB is empty or unreachable. Used by the root layout so the
 * header/footer render even when the database is briefly down.
 */
export async function getNavCategories(): Promise<Category[]> {
  try {
    const categories = await getAllCategories();
    return categories.length > 0 ? categories : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function getPrimaryCategories(): Promise<Category[]> {
  const rows = await readQuery<CategoryRow>(
    [],
    `SELECT * FROM categories WHERE in_primary_nav = 1 ${ORDER}`
  );
  const mapped = rows.map(mapRow);
  return mapped.length > 0
    ? mapped
    : FALLBACK_CATEGORIES.filter((c) => c.inPrimaryNav);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const rows = await readQuery<CategoryRow>(
    [],
    "SELECT * FROM categories WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (rows[0]) return mapRow(rows[0]);
  return FALLBACK_CATEGORIES.find((c) => c.slug === slug);
}

export async function isCategorySlug(slug: string): Promise<boolean> {
  const rows = await query<{ id: number }>(
    "SELECT id FROM categories WHERE slug = ? LIMIT 1",
    [slug]
  );
  return rows.length > 0;
}

/**
 * Creates a category from a display name. New categories are not added to the
 * primary nav — they show up in the header "More" dropdown and the footer
 * automatically (via `sort_order` 100 + `in_primary_nav` 0).
 */
export async function createCategory(name: string): Promise<Category> {
  const trimmed = name.trim();
  const slug = slugify(trimmed);
  if (!slug) throw new Error("Could not derive a slug from that name.");
  await execute(
    `INSERT INTO categories (slug, name, description, sort_order, in_primary_nav)
     VALUES (?, ?, '', 100, 0)`,
    [slug, trimmed]
  );
  const created = await getCategoryBySlug(slug);
  if (!created) throw new Error("Category was not created.");
  return created;
}
