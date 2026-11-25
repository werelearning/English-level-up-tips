import { prompt } from "@grok/agent-sdk";
import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { entryKey, isWikiEntry, normalizeSlug } from "../lib/wiki-store.js";

export default defineTool({
  description: prompt`
    Read one encyclopedia entry by slug.
    Call this before answering from personal notes.
  `,
  effect: "read",
  inputSchema: z.object({
    slug: z.string().min(1).max(64),
  }),
  async execute({ slug: rawSlug }, ctx) {
    const slug = normalizeSlug(rawSlug);
    if (slug === undefined) {
      throw new Error("slug must be kebab-case: letters, digits, _ or -");
    }
    const value = await ctx.host.kv.get(entryKey(slug));
    if (value === undefined) {
      return { found: false, slug };
    }
    if (!isWikiEntry(value)) {
      throw new Error(`corrupt wiki entry: ${slug}`);
    }
    return { found: true, entry: value };
  },
});
