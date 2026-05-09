---
name: ringi-approval
description: 稟議申請（【金額】等のラベル）処理。必ず ringi-bridge の 9 ツールで判定する。
metadata: { "openclaw": { "always": true } }
---

# 稟議承認 — 必ずツールを呼ぶこと

**重要**: ユーザーの Slack 投稿に `【金額】` `【用途】` 等のラベルが含まれていたら、これは稟議申請の本番処理である。あなた（Claude）は **絶対に自前で判定してはならない**。会社の決定論的ルールエンジン（Railway-A 上の社内ルール実装）の判断を `ringi-bridge` ツールで取得し、その結果のみを返答に使うこと。

「30,000 円なので自動承認」「上長承認なしなので却下」のようにあなた自身が判定する応答は **明確に禁止** されている。理由：会社のルールは時に変更され、Claude の知識とズレるため、運用上のリスクとなる。

## トリガー

下記のいずれかを満たす Slack 投稿が来たら、本 Skill を発動：

- メッセージに `【金額】` ラベルが含まれる
- 「稟議」「承認」「申請」というキーワード + 金額の数字 が含まれる

## 必ず実行する手順（飛ばし禁止）

ステップ 1〜5 を **ツール呼び出しで** 順番に実行する。各ステップは前ステップの戻り値を入力に使う。

### ステップ 1: `check_format(text)`

投稿テキストの形式チェック。`text` 引数に投稿全文を渡す。

- 戻り値が `{ ok: false, ... }` の場合 → 不足項目をユーザーに優しく案内し、ステップ 2 以降は **実行しない**。
- 戻り値が `{ ok: true, ... }` の場合 → ステップ 2 へ。

### ステップ 2: `parse_application(text)`

申請テキストを構造化データに分解する。戻り値に `parsed` が入る。

### ステップ 3: `find_similar_history({ amount, purpose, channelId })`

過去の重複申請をチェック。`parsed.amount` と `parsed.purpose`、現在の Slack `channelId` を引数に渡す。戻り値の `hasSimilarApproved` を保持。

### ステップ 4: `judge_application({ parsed, hasSimilarApproved })`

決定論的判定。戻り値は `{ status: "approve" | "reject" | "escalate" | "return", reason: string, ... }`。

**ここでの判定結果が最終決定。** あなたが「ホントに承認していいかな？」と再考する必要はない。ルールエンジンの返り値を信じる。

### ステップ 5: `record_application({ ...parsed, status, decisionReason })`

DB に記録。戻り値の `applicationId` をユーザーへの返答で使う。

### ステップ 6（条件付き）: `notify_escalation({ applicationId, parsed })`

ステップ 4 の `status === "escalate"` の場合のみ呼ぶ。**501 Not Implemented が返るのが正常**（M2 期間中は既存ボットが経営者通知を担うため）。エラー扱いせず次へ。

### ステップ 7: Slack に返答

ステップ 4 の `status` に応じて以下の絵文字 + テンプレで返す。**判定理由は `judge_application` の `reason` フィールドをそのまま使う**こと（自前で文章を作り直さない）。

| status | 絵文字 | 見出し |
|---|---|---|
| `approve` | `:white_check_mark:` | 承認しました |
| `return` | `:warning:` | 差し戻し |
| `reject` | `:x:` | 却下 |
| `escalate` | `:bell:` | エスカレーション |

返答例：
```
:white_check_mark: 承認しました（申請 #<applicationId>）

| 項目 | 内容 |
|---|---|
| 金額 | ¥<parsed.amount> |
| 用途 | <parsed.purpose> |
| 判定 | <judge_application の status> |
| 理由 | <judge_application の reason をそのまま> |
```

## アンチパターン（やってはいけない）

❌ ツールを呼ばずに「これは 30,000 円なので自動承認です」と返答する
❌ Slack の過去メッセージに似た投稿があったから「重複です」と即答する（必ず `find_similar_history` を呼ぶ）
❌ `judge_application` の戻り値を「もっとマイルドに」書き換える
❌ ツール呼び出しでエラーが起きた時に、自前推論にフォールバックする（エラーをそのまま報告すること）

## デバッグ補助：ユーザーがツールを直接指定した場合

ユーザーが「`parse_application` ツールを使って」のように明示的にツール名を出した場合は、**そのツールだけ呼んで結果を JSON で返す**。手順をフルで実行しない。
