---
description: Use when answering Cursor product questions about Agent, Cloud Agents, Rules, Skills, MCP, models, billing, shortcuts, or troubleshooting.
---

# Cursor product guide

Ground answers in current Cursor product behavior. Prefer short, actionable steps. When unsure about a UI label or pricing detail, say so and point to `https://cursor.com/docs`.

## Product map

| Area | What it is |
| --- | --- |
| Agent | In-editor coding agent: reads/edits code, runs terminal, searches, browsers, etc. Open with Cmd/Ctrl+I. |
| Cloud Agents | Same agent fundamentals in isolated cloud VMs; can build/test, open PRs, run in parallel, shareable with teammates. |
| Rules | Always-on or glob-scoped project guidance (`.cursor/rules`, `AGENTS.md`). |
| Skills | On-demand procedures the agent loads when relevant. |
| MCP | External tools/data via Model Context Protocol (HTTP or stdio). |
| Apps | Published web apps from cloud agents (`publish-app`). |
| Checkpoints | Local snapshots of agent file changes for rollback (not a Git substitute). |

## Agent (Desktop / Agents Window)

- Built from instructions + tools + model.
- Tools include search, read/edit files, shell, web, browser, image generation, AskQuestion.
- Checkpoints: restore files from a prior point in the chat timeline; messages stay.
- Queue: Enter queues a follow-up; Cmd/Ctrl+Enter sends immediately / steers sooner.
- Side chat: `/side` or `/btw` for a tangent without derailing the main thread.
- Goals: `/goal …` for a long-lived objective until complete.
- Conversation search: Cmd/Ctrl+K in Agents Window.

## Cloud Agents

- Need connected source control (GitHub / GitLab / Azure DevOps / Bitbucket) with write access.
- Kick off from iOS, cursor.com/agents, Desktop (Cloud), Slack, GitHub/Bitbucket comments, Linear, or API.
- Environment quality matters: deps, secrets, network, startup. Configure via environment setup / Builds / snapshots / `.cursor/environment.json`.
- Secrets: add in Cloud Agents dashboard; injected at agent start only — restart to pick up new secrets.
- MCP: team-configured servers; OAuth supported where needed.
- Free and Plus plans do not include Cloud Agents; Premium+, Teams, Enterprise, or legacy paid plans do.
- Formerly called Background Agents.

## Rules vs Skills vs MCP

- **Rules**: durable project/team guidance always (or often) in context.
- **Skills**: load only when the task matches the skill description.
- **MCP**: live tools against external systems; do not put secrets in chat.

## Practical tips to teach users

1. Put durable repo conventions in Rules / `AGENTS.md`, not in every prompt.
2. Put multi-step playbooks in Skills.
3. Put API/database/SaaS access in MCP, with least privilege.
4. For Cloud Agents, invest in environment setup before expecting reliable tests/PRs.
5. Prefer Git for permanent history; use Checkpoints only to undo agent edits.

## Answer style for this skill

1. Name the Cursor surface involved (Agent, Cloud, Rules, …).
2. Give the shortest path in the product.
3. If the user wants it remembered, call `wiki_save` with a clear slug and tags like `cursor`, `cloud`, `rules`.
