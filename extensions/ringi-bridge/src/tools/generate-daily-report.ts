import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";
import { YmdSchema } from "./_schemas.js";

const Schema = Type.Object(
  {
    date: YmdSchema,
  },
  { additionalProperties: false },
);

/**
 * #8 generate_daily_report
 *
 * 指定日（YYYY-MM-DD）の日次レポート文字列を生成して返す。Slack 送信は行わない。
 */
export function createGenerateDailyReportTool(): AnyAgentTool {
  return {
    name: "generate_daily_report",
    label: "Generate Daily Report",
    description:
      "指定日（YYYY-MM-DD）の日次レポート文字列を生成して返す。Slack 送信は行わない。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/generate_daily_report", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
