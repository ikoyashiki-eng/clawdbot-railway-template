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
      "投稿テキストが稟議申請のフォーマット（必須ラベル・最小行数）を満たすかを軽量チェック。判定フロー（parse_application → judge_application）を実行する前段で、不完全な投稿を早期フィルタするために必ず使う。Claude が目視で『これは申請っぽい』と判断する代わりにこのツールで判定する。",
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
