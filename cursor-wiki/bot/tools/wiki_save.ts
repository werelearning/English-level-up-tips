import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  emptyIndex,
  entryKey,
  INDEX_KEY,
  isWikiIndex,
  normalizeSlug,
  type WikiEntry,
  type WikiIndex,
} from "../lib/wiki-store.js";

export default defineTool({
  description: prompt`
    Create or replace one personal encyclopedia entry.
    Use for Cursor tips, personal prefs, workflows, glossaries, and durable Q&A notes.
    Prefer a short kebab-case slug.
  `,
  effect: "idempotent",
  inputSchema: z.object({
    slug: z.string().min(1).max(64),
    title: z.string().min(1).max(160),
    tags: z.array(z.string().min(1).max(40)).max(12).default([]),
    body: z.string().min(1).max(20_000),
  }),
  dryRunResult: ({ slug, title, tags }) => ({
    saved: false,
    dryRun: true,
    slug,
    title,
    tags,
  }),
  async execute({ slug: rawSlug, title, tags, body }, ctx) {
    const slug = normalizeSlug(rawSlug);
    if (slug === undefined) {
      throw new Error("slug must be kebab-case: letters, digits, _ or -");
    }
    const entry: WikiEntry = {
      slug,
      title: title.trim(),
      tags: [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))],
      body: body.trim(),
      updatedAt: new Date().toISOString(),
    };
    await ctx.host.kv.put(entryKey(slug), entry);

    const rawIndex = await ctx.host.kv.get(INDEX_KEY);
    const index: WikiIndex = isWikiIndex(rawIndex) ? rawIndex : emptyIndex();
    if (!index.slugs.includes(slug)) {
      index.slugs = [...index.slugs, slug].sort();
      await ctx.host.kv.put(INDEX_KEY, index);
    }

    return {
      saved: true,
      slug: entry.slug,
      title: entry.title,
      tags: entry.tags,
      updatedAt: entry.updatedAt,
      bodyChars: entry.body.length,
    };
  },
});
