---
description: Use when creating, updating, organizing, or deleting personal encyclopedia entries about Cursor or other durable notes.
---

# Wiki curation

## When to save

Save when the user asks to remember something, or when a durable fact will help later:

- personal Cursor preferences (model defaults, review habits)
- workflow recipes (how they open PRs, naming branches)
- glossaries and FAQ answers they reuse
- troubleshooting resolutions that worked for them

Do **not** save ephemeral chat fluff, secrets, API keys, tokens, or passwords.

## Entry shape

- **slug**: short kebab-case, stable (`agent-checkpoints`, `slack-cloud-kickoff`)
- **title**: human title in the user's language
- **tags**: lowercase, few (`cursor`, `cloud`, `mcp`, `workflow`)
- **body**: short Markdown — conclusion first, then steps; no marketing tone

## Update vs new

1. `wiki_search` / `wiki_list` for an existing slug.
2. If close match exists, `wiki_get` then `wiki_save` with the same slug and merged body.
3. Otherwise create a new slug.

## Delete

Only after an explicit delete request. Confirm the slug in the reply.
