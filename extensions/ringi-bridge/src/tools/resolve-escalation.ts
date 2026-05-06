import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";
import { postToRailwayA } from "../client.js";

const Schema = Type.Object(
  {
    applicationId: Type.Integer({ minimum: 1 }),
    decision: Type.Union([Type.Literal("approve"), Type.Literal("reject")]),
    reviewerNote: Type.Optional(Type.String()),
  },
  { additionalProperties: false },
);

/**
 * #7 resolve_escalation
 *
 * 経営者の承認/却下を反映し、申請ステータスとエスカレーション解決済みフラグを更新する。
 */
export function createResolveEscalationTool(): AnyAgentTool {
  return {
    name: "resolve_escalation",
    label: "Resolve Escalation",
    description:
      "経営者の承認/却下を反映し、申請ステータスとエスカレーション解決済みフラグを更新する。",
    parameters: Schema,
    async execute(_toolCallId, params) {
      const result = await postToRailwayA("/tools/resolve_escalation", params);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        details: result,
      };
    },
  };
}
