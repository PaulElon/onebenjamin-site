// Visit and click counter for onebenjamin.pages.dev. Stores page, source, event and day only: no cookies, no IP, no user agent.
const EVENTS = new Set(["view", "kit_click", "repo_click", "x_click", "sample_click", "app_click"]);
export async function onRequest({ request, env }) {
  const u = new URL(request.url);
  const path = (u.searchParams.get("p") || "/").replace(/[^\w\-\/\.]/g, "").slice(0, 80) || "/";
  const src = (u.searchParams.get("s") || "direct").toLowerCase().replace(/[^a-z0-9.\-_]/g, "").slice(0, 60) || "direct";
  const e = u.searchParams.get("e");
  const event = EVENTS.has(e) ? e : "view";
  const day = new Date().toISOString().slice(0, 10);
  await env.DB.prepare(
    "INSERT INTO hits (day, path, src, event, n) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT(day, path, src, event) DO UPDATE SET n = n + 1"
  ).bind(day, path, src, event).run();
  return new Response(null, { status: 204, headers: { "cache-control": "no-store", "access-control-allow-origin": "*" } });
}
