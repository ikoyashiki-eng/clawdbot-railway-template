import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/lobster";

const Schema = Type.Object(
  {
    applicationId: Type.Integer({ minimum: 1 }),
    parsed: Type.Optional(Type.Unknown()),
  },
  { additionalProperties: false },
);

/**
 * #6 notify_escalation （501 スタブ）
 *
 * 経営者へのエスカレーション通知（DM 送信）。
 * 設計書 §5・10章 Q3 の決定により、能動通知は既存ボット（Railway-A）の責務に固定。
 * したがって本ツールは **意図的にスタブ** として 501 相当のエラー応答を返す。
 *
 * Railway-A 側を呼ばない（呼んでも 501 が返る前提）ことで、ネットワーク往復も省く。
 */
export function createNotifyEscalationTool(): AnyAgentTool {
  return {
    name: "notify_escalation",
    label: "Notify Escalation (stub)",
    description:
      "経営者へのエスカレーション通知（DM 送信）。M2 期間中は意図的にスタブ：本ツールは呼ばず、経営者 DM は OpenClaw のネイティブ Slack 送信機能で行うこと。",
    parameters: Schema,
    async execute(_toolCallId, _params) {
      const payload = {
        ok: false,
        status: 501,
        error: "not_implemented",
        message:
          "[ringi-bridge] notify_escalation は M2 期間中スタブです。経営者 DM は OpenClaw 側のネイティブ Slack 送信機能で実装してください。",
      };
      return {
        isError: true,
        content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
        details: payload,
      };
    },
  };
}
