import { getOgImageUrl } from 'components/ogImageHelper';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const result = await getOgImageUrl("assets/blog-images/2025/teleport-weakaura.png", "/default.jpg");
  return new Response(JSON.stringify({ url: result }), {
    headers: { 'Content-Type': 'application/json' }
  });
};

