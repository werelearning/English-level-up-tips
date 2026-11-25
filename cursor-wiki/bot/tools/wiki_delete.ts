import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  emptyIndex,
  entryKey,
  INDEX_KEY,
  isWikiIndex,
  normalizeSlug,
  type WikiIndex,
} from "../lib/wiki-store.js";

export default defineTool({
  description: prompt`
    Delete one encyclopedia entry by slug.
    Only call after the user clearly asks to remove it.
  `,
  effect: "write",
  inputSchema: z.object({
    slug: z.string().min(1).max(64),
  }),
  dryRunResult: ({ slug }) => ({ deleted: false, dryRun: true, slug }),
  async execute({ slug: rawSlug }, ctx) {
    const slug = normalizeSlug(rawSlug);
    if (slug === undefined) {
      throw new Error("slug must be kebab-case: letters, digits, _ or -");
    }
    const existing = await ctx.host.kv.get(entryKey(slug));
    await ctx.host.kv.delete(entryKey(slug));

    const rawIndex = await ctx.host.kv.get(INDEX_KEY);
    const index: WikiIndex = isWikiIndex(rawIndex) ? rawIndex : emptyIndex();
    const next = index.slugs.filter((item) => item !== slug);
    if (next.length !== index.slugs.length) {
      await ctx.host.kv.put(INDEX_KEY, { slugs: next });
    }

    return { deleted: existing !== undefined, slug };
  },
});
