export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname.startsWith("/api/hdn")) {
      const upstreamPath = pathname.replace(/^\/api\/hdn/, "/api");
      const upstreamUrl = new URL(upstreamPath + url.search, "https://hd-notification.chatterer.workers.dev");
      const upstreamResponse = await fetch(upstreamUrl.toString(), {
        headers: {
          Accept: "application/json",
        },
      });

      const headers = new Headers(upstreamResponse.headers);
      const origin = request.headers.get("origin");
      const allowedOrigins = ["https://chatter.kr", "http://localhost:4321", "http://127.0.0.1:4321"];

      if (origin && allowedOrigins.includes(origin)) {
        headers.set("Access-Control-Allow-Origin", origin);
        headers.set("Vary", "Origin");
      }

      if (request.method === "OPTIONS") {
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return new Response(null, { status: 204, headers });
      }

      return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers,
      });
    }

    // 1. .html 제거
    if (pathname.endsWith(".html")) {
      url.pathname = pathname.replace(/\.html$/, "");
      return Response.redirect(url.toString(), 301);
    }

    // 2. trailing slash 제거 (파일 제외)
    const lastSegment = pathname.split("/").pop() || "";
    const hasExtension = /\.[a-zA-Z0-9]{2,4}$/.test(lastSegment);

    if (
      pathname.endsWith("/") &&
      pathname.length > 1 &&
      !hasExtension
    ) {
      url.pathname = pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // 정적 자산 응답
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    const cacheControl = contentType.includes("text/html")
      ? "public, max-age=3600"
      : "public, max-age=2628000, immutable";

    const headers = new Headers(response.headers);
    headers.set("cache-control", cacheControl);
    headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
    headers.set("x-content-type-options", "nosniff");
    headers.set("x-frame-options", "DENY");
    headers.set("referrer-policy", "strict-origin-when-cross-origin");

    return new Response(response.body, {
      status: response.status,
      headers
    });
  }
};
