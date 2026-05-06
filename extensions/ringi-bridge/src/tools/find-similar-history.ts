import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";

const Schema = Type.Object(
  {
    purpose: Type.String({
      minLength: 1,
      description: "用途キーワード（部分一致）",
    }),
    amount: Type.Integer({ minimum: 0 }),
    channelId: Type.String({
      minLength: 1,
      description: "Slack チャンネル ID",
    }),
  },
  { additionalProperties: false },
);

/**
 * #4 find_similar_history
 *
 * 用途キーワード一致で過去の承認済み申請を最大10件返す。
 */
export function createFindSimilarHistoryTool(): AnyAgentTool {
  return {
    name: "find_similar_history",
    label: "Find Similar History",
    description: "用途キーワード一致で過去の承認済み申請を最大10件返す。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/find_similar_history", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
