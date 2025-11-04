import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log("Worker is running:", url.pathname);

    // ✅ 루트("/") → index.html
    if (url.pathname === "/") {
      return await getAssetFromKV({ request, waitUntil: ctx.waitUntil.bind(ctx) }, { mapRequestToAsset: req => req });
    }

    // ✅ 슬래시 제거 리디렉션
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 정적 자산 서빙
    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        {
          mapRequestToAsset: (req) => {
            const pathname = new URL(req.url).pathname;
            if (pathname.endsWith(".html")) return req;
            return new Request(`${url.origin}${pathname}/index.html`, req);
          },
        }
      );
    } catch (err) {
      console.error("Asset fetch failed:", err);
      return new Response("404 Not Found", { status: 404 });
    }
  },
};
