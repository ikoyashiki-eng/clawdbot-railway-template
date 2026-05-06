import type { OpenClawPluginApi } from "openclaw/plugin-sdk/lobster";
import { createCheckFormatTool } from "./src/tools/check-format.js";
import { createFindSimilarHistoryTool } from "./src/tools/find-similar-history.js";
import { createGenerateDailyReportTool } from "./src/tools/generate-daily-report.js";
import { createGenerateWeeklyReportTool } from "./src/tools/generate-weekly-report.js";
import { createJudgeApplicationTool } from "./src/tools/judge-application.js";
import { createNotifyEscalationTool } from "./src/tools/notify-escalation.js";
import { createParseApplicationTool } from "./src/tools/parse-application.js";
import { createRecordApplicationTool } from "./src/tools/record-application.js";
import { createResolveEscalationTool } from "./src/tools/resolve-escalation.js";

/**
 * ringi-bridge プラグインのエントリポイント。
 *
 * OpenClaw（Railway-B）から呼ばれる 9 つのカスタムツールを登録する。
 * すべて Railway-A の内部 HTTP サーバーへ Bearer 認証でフォワードする
 * 薄いブリッジ実装（notify_escalation のみ意図的にスタブ）。
 */
const plugin = {
  id: "ringi-bridge",
  name: "Ringi Bridge",
  description:
    "Bridges 9 ringi-approval custom tools to the Railway-A internal HTTP server over Bearer auth.",
  configSchema: {
    type: "object" as const,
    additionalProperties: false,
    properties: {},
  },
  register(api: OpenClawPluginApi) {
    api.registerTool(createParseApplicationTool());
    api.registerTool(createCheckFormatTool());
    api.registerTool(createJudgeApplicationTool());
    api.registerTool(createFindSimilarHistoryTool());
    api.registerTool(createRecordApplicationTool());
    api.registerTool(createNotifyEscalationTool());
    api.registerTool(createResolveEscalationTool());
    api.registerTool(createGenerateDailyReportTool());
    api.registerTool(createGenerateWeeklyReportTool());
  },
};

export default plugin;
