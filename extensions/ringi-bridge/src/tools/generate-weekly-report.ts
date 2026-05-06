import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";
import { YmdSchema } from "./_schemas.js";

const Schema = Type.Object(
  {
    from: YmdSchema,
    to: YmdSchema,
  },
  { additionalProperties: false },
);

/**
 * #9 generate_weekly_report
 *
 * from-to 期間（YYYY-MM-DD）の週次レポート文字列を生成して返す。Slack 送信は行わない。
 */
export function createGenerateWeeklyReportTool(): AnyAgentTool {
  return {
    name: "generate_weekly_report",
    label: "Generate Weekly Report",
    description:
      "from-to 期間（YYYY-MM-DD）の週次レポート文字列を生成して返す。Slack 送信は行わない。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/generate_weekly_report", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
