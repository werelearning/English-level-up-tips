# cursor-wiki

Cursor 百科助手：管理个人 Cursor 知识词条，并回答 Cursor 与一般疑问。

## Quick start

```bash
cd cursor-wiki
npx @grok/agent-sdk@0.7.3 login
npx @grok/agent-sdk@0.7.3 dev
# open http://127.0.0.1:3000/playground
```

## Tools

| Tool | Effect | Purpose |
| --- | --- | --- |
| `wiki_save` | idempotent | Create/replace a wiki entry |
| `wiki_get` | read | Read one entry by slug |
| `wiki_list` | read | List entries (optional tag filter) |
| `wiki_search` | read | Keyword search |
| `wiki_delete` | write | Delete one entry |

Entries live in durable `ctx.host.kv` under `wiki:entry:<slug>`.
