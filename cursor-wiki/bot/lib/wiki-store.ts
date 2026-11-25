export type WikiEntry = {
  slug: string;
  title: string;
  tags: string[];
  body: string;
  updatedAt: string;
};

export type WikiIndex = {
  slugs: string[];
};

export const INDEX_KEY = "wiki:index";

const SLUG = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function normalizeSlug(raw: string): string | undefined {
  const slug = raw.trim().toLowerCase().replace(/\s+/g, "-");
  if (!SLUG.test(slug)) {
    return undefined;
  }
  return slug;
}

export function entryKey(slug: string): string {
  return `wiki:entry:${slug}`;
}

export function emptyIndex(): WikiIndex {
  return { slugs: [] };
}

export function isWikiEntry(value: unknown): value is WikiEntry {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const row = value as Record<string, unknown>;
  return (
    typeof row.slug === "string" &&
    typeof row.title === "string" &&
    Array.isArray(row.tags) &&
    row.tags.every((tag) => typeof tag === "string") &&
    typeof row.body === "string" &&
    typeof row.updatedAt === "string"
  );
}

export function isWikiIndex(value: unknown): value is WikiIndex {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const row = value as Record<string, unknown>;
  return Array.isArray(row.slugs) && row.slugs.every((slug) => typeof slug === "string");
}

export function matchesQuery(entry: WikiEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q === "") {
    return true;
  }
  const haystack = [entry.slug, entry.title, entry.tags.join(" "), entry.body]
    .join("\n")
    .toLowerCase();
  return q.split(/\s+/).every((token) => haystack.includes(token));
}
