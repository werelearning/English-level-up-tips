import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  emptyIndex,
  entryKey,
  INDEX_KEY,
  isWikiEntry,
  isWikiIndex,
} from "../lib/wiki-store.js";

export default defineTool({
  description: prompt`
    List encyclopedia entry titles, tags, and update times.
    Use before search when the user asks what is stored.
  `,
  effect: "read",
  inputSchema: z.object({
    tag: z.string().min(1).max(40).optional(),
  }),
  async execute({ tag }, ctx) {
    const rawIndex = await ctx.host.kv.get(INDEX_KEY);
    const index = isWikiIndex(rawIndex) ? rawIndex : emptyIndex();
    const wanted = tag?.trim().toLowerCase();
    const items: Array<{
      slug: string;
      title: string;
      tags: string[];
      updatedAt: string;
    }> = [];

    for (const slug of index.slugs) {
      const value = await ctx.host.kv.get(entryKey(slug));
      if (!isWikiEntry(value)) {
        continue;
      }
      if (wanted !== undefined && !value.tags.includes(wanted)) {
        continue;
      }
      items.push({
        slug: value.slug,
        title: value.title,
        tags: value.tags,
        updatedAt: value.updatedAt,
      });
    }

    return { count: items.length, items };
  },
});
