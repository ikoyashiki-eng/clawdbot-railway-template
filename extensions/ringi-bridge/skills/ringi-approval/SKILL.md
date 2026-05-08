---
name: ringi-approval
description: Slack の #稟議申請-openclaw チャンネルに投稿される【金額】形式の稟議申請を、ringi-bridge の 9 ツールを使って受領・解析・判定・記録し結果を返す。
---

# 稟議承認エージェント

Slack の `#稟議申請-openclaw` チャンネルにユーザーが投稿した「稟議申請」を処理するための手順。`【金額】` `【用途】` などのラベル付きメッセージが投稿されたら、必ず下記の手順を **ツール呼び出しで** 実行する（自前で推論して判定を返さない）。

## いつ使うか

ユーザーの Slack 投稿に下記のいずれかが含まれている場合：

- 「【金額】」というラベル
- 「稟議」「承認」「申請」というキーワード + 金額の数値

## 必ず使うツール（順番）

1. **`check_format`** — 投稿テキストが申請フォーマットを満たすかチェック
   - `false` が返ったら、不足項目をユーザーに優しく案内して終了
2. **`parse_application`** — テキストから `amount` `purpose` `goal` `costEffectiveness` `managerApproval` `productReason` `attachments` を抽出
3. **`find_similar_history`** — 過去に同様の承認済み申請があるか確認（`amount` `purpose` `channelId` を引数に）。結果の `hasSimilarApproved` を次に渡す
4. **`judge_application`** — `parsed` と `hasSimilarApproved` を渡して判定（`approve` / `reject` / `escalate` / `return`）
5. **`record_application`** — 判定結果を DB に記録（`status` `decisionReason` 含む）
6. 判定が `escalate` の場合のみ **`notify_escalation`** を呼ぶ（ただし設計上 501 が返る意図的スタブ。エラー扱いせずスルー）
7. ユーザーに **判定結果と理由** を Slack で返答（自然な日本語、絵文字 OK）

## 注意

- **判定ロジックを自前で推論しない**。必ず `judge_application` ツールの返り値を信用する。Claude が「30,000 円なので自動承認」のように勝手に判定してはいけない。
- 金額が空・0・読み取れない場合は、ツールを呼ぶ前にユーザーに金額を確認する。
- `notify_escalation` は 501 を返すのが正常（M2 期間中は既存ボットが経営者通知を担うため）。

## 返答テンプレ

```
:white_check_mark: 承認しました（自動承認）
- 金額: ¥30,000
- 用途: ホワイトボード購入
- 判定: judge_application 結果に基づく
- 理由: <judge_application の reason フィールド>
```

却下／差し戻し／エスカレの場合も、それぞれ `:x:` `:warning:` `:bell:` 絵文字で視覚的に区別する。
