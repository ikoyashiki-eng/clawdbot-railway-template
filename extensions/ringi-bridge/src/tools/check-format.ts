import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";

const Schema = Type.Object(
  {
    text: Type.String({ minLength: 1 }),
  },
  { additionalProperties: false },
);

/**
 * #2 check_format
 *
 * テキストが申請フォーマット（【金額】を含む）か軽量チェック。
 */
export function createCheckFormatTool(): AnyAgentTool {
  return {
    name: "check_format",
    label: "Check Format",
    description:
      "テキストが申請フォーマット（【金額】を含む）かどうかを判定する軽量チェック。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/check_format", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
