import { getConfig } from "./config.js";

/**
 * Railway-A の内部 HTTP サーバーに対して POST する共通クライアント。
 *
 * - Bearer 認証を付与
 * - 非 2xx は本文込みのエラーで throw
 * - JSON でないレスポンスはテキストのまま返す（{ raw: string }）
 */
export async function postToRailwayA(
  path: string,
  body: unknown,
): Promise<unknown> {
  const config = getConfig();
  const url = `${config.railwayAInternalUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openclawToolsBearer}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `[ringi-bridge] HTTP ${res.status} from ${path}: ${text || "(empty body)"}`,
    );
  }

  if (text.trim() === "") {
    return {};
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}
