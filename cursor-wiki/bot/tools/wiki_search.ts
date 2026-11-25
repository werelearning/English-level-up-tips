import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  emptyIndex,
  entryKey,
  INDEX_KEY,
  isWikiEntry,
  isWikiIndex,
  matchesQuery,
} from "../lib/wiki-store.js";

export default defineTool({
  description: prompt`
    Search personal encyclopedia entries by keyword across title, tags, and body.
    Prefer this when the user asks a question that may already be saved.
  `,
  effect: "read",
  inputSchema: z.object({
    query: z.string().min(1).max(200),
    limit: z.number().int().min(1).max(20).default(8),
  }),
  async execute({ query, limit }, ctx) {
    const rawIndex = await ctx.host.kv.get(INDEX_KEY);
    const index = isWikiIndex(rawIndex) ? rawIndex : emptyIndex();
    const hits: Array<{
      slug: string;
      title: string;
      tags: string[];
      snippet: string;
      updatedAt: string;
    }> = [];

    for (const slug of index.slugs) {
      const value = await ctx.host.kv.get(entryKey(slug));
      if (!isWikiEntry(value) || !matchesQuery(value, query)) {
        continue;
      }
      hits.push({
        slug: value.slug,
        title: value.title,
        tags: value.tags,
        snippet: value.body.slice(0, 240),
        updatedAt: value.updatedAt,
      });
      if (hits.length >= limit) {
        break;
      }
    }

    return { query, count: hits.length, hits };
  },
});
