import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";

const Schema = Type.Object(
  {
    text: Type.String({
      minLength: 1,
      description: "Slack に投稿された申請テキスト全文",
    }),
  },
  { additionalProperties: false },
);

/**
 * #1 parse_application
 *
 * Slack の申請テキスト（【金額】【用途】等）を構造化データにパースする。
 * Railway-A 側の `parser/application-parser.ts: parseApplication` を呼ぶ。
 */
export function createParseApplicationTool(): AnyAgentTool {
  return {
    name: "parse_application",
    label: "Parse Application",
    description:
      "稟議申請テキスト（【金額】【用途】【上長承認】等のラベル形式）を構造化データに分解する。Claude が自前で正規表現や推論で抽出する代わりに必ずこのツールを使うこと。Railway-A 上の本番パーサ実装に直結しており、社内のラベル仕様に厳密に従う。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/parse_application", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
