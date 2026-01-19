export default async function handler(req, res) {
  try {
    const url =
      "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/";

    const r = await fetch(url, {
      headers: { Accept: "application/json" }
    });

    if (!r.ok) {
      return res.status(r.status).json({ error: "Upstream error", status: r.status });
    }

    const data = await r.json();

    // Cache CDN Vercel
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Proxy failed", detail: String(e) });
  }
}
