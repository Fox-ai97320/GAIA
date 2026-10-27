const PROFILES = {
  "GAIA général": "Assistant généraliste utile et clair.",
  Atlas: "Recherche, synthèse et analyse critique. Ne prétends pas avoir consulté Internet.",
  Forge: "Développement web, code et débogage. Explique les étapes.",
  Nova: "Idées créatives, concepts et scénarios.",
  Pixel: "Design UI/UX, accessibilité et interfaces.",
  Mercure: "Organisation, projets et productivité.",
  Sage: "Pédagogie, exercices et explications progressives.",
  Sentinelle: "Sécurité numérique, confidentialité et bonnes pratiques."
};
const ALLOWED_ORIGIN = "https://fox-ai97320.github.io";
function headers(origin) {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? origin : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
    "Cache-Control": "no-store"
  };
}
function json(body, status, origin) { return new Response(JSON.stringify(body), {status, headers: headers(origin)}); }
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS") return new Response(null, {status: 204, headers: headers(origin)});
    if (request.method !== "POST") return json({error:"Méthode non autorisée"}, 405, origin);
    if (origin !== ALLOWED_ORIGIN) return json({error:"Origine non autorisée"}, 403, origin);
    if (Number(request.headers.get("Content-Length") || 0) > 12000) return json({error:"Message trop volumineux"}, 413, origin);
    let data;
    try { data = await request.json(); } catch { return json({error:"JSON invalide"}, 400, origin); }
    const message = typeof data.message === "string" ? data.message.trim() : "";
    const agent = typeof data.agent === "string" && Object.hasOwn(PROFILES, data.agent) ? data.agent : "GAIA général";
    if (!message || message.length > 2500) return json({error:"Message requis (2500 caractères maximum)"}, 400, origin);
    if (!env.AI) return json({error:"Liaison Workers AI manquante"}, 503, origin);
    try {
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fp8", {
        messages: [
          {role:"system", content:"Tu es GAIA, une IA francophone utile, prudente et honnête. Profil: " + PROFILES[agent] + " Réponds en français. Si tu ignores une information, dis-le. Tu ne peux ni agir sur le téléphone ni accéder aux comptes ou au Web sans outil connecté."},
          {role:"user", content:message}
        ],
        max_tokens: 550,
        temperature: 0.6
      });
      return json({reply: typeof result.response === "string" ? result.response : "Aucune réponse générée."}, 200, origin);
    } catch (e) {
      console.error("Workers AI error", String(e), e?.message, e?.stack);
      return json({error:"Le modèle IA est indisponible ou le quota est atteint."}, 503, origin);
    }
  }
};
