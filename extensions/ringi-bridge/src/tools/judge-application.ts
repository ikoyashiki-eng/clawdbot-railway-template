import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";
import { ParsedApplicationSchema } from "./_schemas.js";

const Schema = Type.Object(
  {
    parsed: ParsedApplicationSchema,
    hasSimilarApproved: Type.Boolean({
      description: "過去に類似の承認済み申請があるかどうか",
    }),
    options: Type.Optional(
      Type.Object(
        {
          testMode: Type.Optional(Type.Boolean()),
        },
        { additionalProperties: false },
      ),
    ),
  },
  { additionalProperties: false },
);

/**
 * #3 judge_application
 *
 * パース済み申請に対し 5万 / 30万 / 6条件の社内ルールで判定し
 * approve/reject/escalate/return を返す。
 */
export function createJudgeApplicationTool(): AnyAgentTool {
  return {
    name: "judge_application",
    label: "Judge Application",
    description:
      "パース済み申請に対して 5万/30万/6条件の社内ルールで判定し approve/reject/escalate/return を返す。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/judge_application", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
