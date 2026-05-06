/**
 * 環境変数を読み取り、未設定ならエラーを投げる。
 *
 * - RAILWAY_A_INTERNAL_URL: Railway-A 側に公開する内部 HTTP サーバーの URL（例: http://railway-a.railway.internal:8080）
 * - OPENCLAW_TOOLS_BEARER:  Railway-A と OpenClaw が共有する Bearer トークン
 */
export interface RingiBridgeConfig {
  readonly railwayAInternalUrl: string;
  readonly openclawToolsBearer: string;
}

function readRequiredEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === "") {
    throw new Error(
      `[ringi-bridge] 必須の環境変数 ${name} が設定されていません。OpenClaw Control UI の env vars を確認してください。`,
    );
  }
  return v;
}

let cached: RingiBridgeConfig | undefined;

/**
 * 設定を遅延ロードして返す。
 * プラグインのロード時点で env が未設定だと即落ちしてしまうため、
 * 実行時（ツール呼び出し時）にだけ読みに行く。
 */
export function getConfig(): RingiBridgeConfig {
  if (!cached) {
    cached = {
      railwayAInternalUrl: readRequiredEnv("RAILWAY_A_INTERNAL_URL").replace(
        /\/+$/,
        "",
      ),
      openclawToolsBearer: readRequiredEnv("OPENCLAW_TOOLS_BEARER"),
    };
  }
  return cached;
}

/** テスト用: キャッシュ破棄 */
export function _resetConfigForTest(): void {
  cached = undefined;
}
