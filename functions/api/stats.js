// Public aggregate stats (the company publishes its numbers). Rows are day, page, source, event, count.
export async function onRequestGet({ request, env }) {
  const q = new URL(request.url).searchParams;
  const days = Math.min(90, Math.max(1, parseInt(q.get("days") || "14", 10) || 14));
  const since = new Date(Date.now() - days * 864e5).toISOString().slice(0, 10);
  const { results } = await env.DB.prepare(
    "SELECT day, path, src, event, n FROM hits WHERE day >= ?1 ORDER BY day DESC, n DESC"
  ).bind(since).all();
  const totals = {}, bySource = {};
  for (const r of results) {
    totals[r.event] = (totals[r.event] || 0) + r.n;
    if (r.event === "view") bySource[r.src] = (bySource[r.src] || 0) + r.n;
  }
  return Response.json({ since, totals, views_by_source: bySource, rows: results }, { headers: { "cache-control": "no-store" } });
}
