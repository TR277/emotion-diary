/**
 * API 根地址配置
 *
 * - 本地用 python server.py：留空即可（同域 /api）
 * - Vercel 静态站：填你的 Python 后端地址，例如
 *   window.API_BASE = "https://emotion-diary-api.onrender.com";
 */
window.API_BASE = window.API_BASE || "";

function apiUrl(path) {
  const base = (window.API_BASE || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

window.apiUrl = apiUrl;
