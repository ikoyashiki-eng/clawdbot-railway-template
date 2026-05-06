import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";

const Schema = Type.Object(
  {
    slackTs: Type.String({ minLength: 1 }),
    slackChannel: Type.String({ minLength: 1 }),
    applicantId: Type.String({ minLength: 1 }),
    applicantName: Type.String({ minLength: 1 }),
    type: Type.Union([Type.Literal("expense"), Type.Literal("purchase")]),
    amount: Type.Integer({ minimum: 0 }),
    purpose: Type.String(),
    goal: Type.String(),
    costEffectiveness: Type.String(),
    managerApproval: Type.String(),
    productReason: Type.String(),
    status: Type.Union([
      Type.Literal("approved"),
      Type.Literal("rejected"),
      Type.Literal("pending"),
      Type.Literal("escalated"),
      Type.Literal("returned"),
    ]),
    agentJudgment: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    managerJudgment: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    rejectionReason: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    source: Type.Optional(
      Type.Union([Type.Literal("legacy"), Type.Literal("openclaw")]),
    ),
  },
  { additionalProperties: false },
);

/**
 * #5 record_application
 *
 * 申請と判定結果を DB に保存する。source 未指定なら 'openclaw' として記録される。
 */
export function createRecordApplicationTool(): AnyAgentTool {
  return {
    name: "record_application",
    label: "Record Application",
    description:
      "申請と判定結果を DB に保存する。source 未指定なら 'openclaw' として記録される。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/record_application", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
