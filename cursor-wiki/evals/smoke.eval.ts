import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Saves a wiki entry when asked to remember a Cursor tip.",
  async test(t) {
    await t.send(
      '请记住这条 Cursor 技巧：Cloud Agent 的 Secrets 只在启动时注入，改完密钥要新开一次 Agent。保存为词条 cloud-agent-secrets。',
    );
    t.succeeded();
    t.calledTool("wiki_save");
  },
});
