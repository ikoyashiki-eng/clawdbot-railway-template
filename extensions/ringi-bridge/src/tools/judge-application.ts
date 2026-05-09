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
      "稟議申請の決定論的判定エンジン。Railway-A 上の社内ルール実装（5万円閾値・30万円閾値・上長承認必須・費用対効果記載・商品選定理由・目的明確化など）を呼び出し、approve/reject/escalate/return のいずれかを返す。Claude は『この金額なら承認』のように自前で判定してはならず、必ずこのツールの戻り値を使うこと。会社のルールは Claude の知識より新しい可能性があり、勝手な判定は運用リスクとなる。",
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
