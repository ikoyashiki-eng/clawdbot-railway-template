import { Type } from "@sinclair/typebox";

/**
 * `ParsedApplication`（src/types.ts 由来）と一致する TypeBox スキーマ。
 * judge_application と record_application 双方で使い回す。
 */
export const ParsedApplicationSchema = Type.Object(
  {
    amount: Type.Number(),
    purpose: Type.String(),
    goal: Type.String(),
    costEffectiveness: Type.String(),
    managerApproval: Type.String(),
    productReason: Type.String(),
    attachments: Type.Array(Type.String()),
  },
  { additionalProperties: false },
);

/** YYYY-MM-DD 形式の文字列 */
export const YmdSchema = Type.String({
  pattern: "^\\d{4}-\\d{2}-\\d{2}$",
  description: "YYYY-MM-DD 形式の日付",
});
