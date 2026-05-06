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
      "Slack の申請テキスト（【金額】【用途】等）を構造化データにパースする。",
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
