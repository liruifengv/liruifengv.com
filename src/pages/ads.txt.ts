import type { APIRoute } from "astro";

const ads = `
google.com, pub-7831922620358624, DIRECT, f08c47fec0942fa0
`.trim();

export const GET: APIRoute = () =>
  new Response(ads, {
    headers: { "Content-Type": "text/plain" },
  });
