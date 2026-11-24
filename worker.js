export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 0. favicon rewrite
    if (pathname === "/favicon.ico") {
      url.pathname = "/icons/favicon.svg";
    }

    // 1. /api/hdn 프록시
    if (pathname.startsWith("/api/hdn")) {
      const upstreamPath = pathname.replace(/^\/api\/hdn/, "/api");
      const upstreamUrl = new URL(
        upstreamPath + url.search,
        "https://hd-notification.chatterer.workers.dev"
      );
      const upstreamResponse = await fetch(upstreamUrl.toString(), {
        headers: {
          Accept: "application/json",
        },
      });

      const headers = new Headers(upstreamResponse.headers);
      const origin = request.headers.get("origin");
      const allowedOrigins = [
        "https://chatter.kr",
        "http://localhost:4321",
        "http://127.0.0.1:4321",
      ];

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

    // 2. .html 제거 (index.html은 디렉터리 경로로 바로 정규화)
    if (pathname.endsWith("/index.html")) {
      // /mcube-vs-p60/index.html -> /mcube-vs-p60
      url.pathname = pathname.slice(0, -"/index.html".length) || "/";
      return Response.redirect(url.toString(), 301);
    }

    if (pathname.endsWith(".html")) {
      // /about.html -> /about
      url.pathname = pathname.replace(/\.html$/, "");
      return Response.redirect(url.toString(), 301);
    }

    // 3. trailing slash 제거 (파일 제외, 루트 제외) — 301
    const lastSegment = pathname.split("/").pop() || "";
    const hasExtension = /\.[a-zA-Z0-9]{2,4}$/.test(lastSegment);

    if (pathname.endsWith("/") && pathname.length > 1 && !hasExtension) {
      url.pathname = pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // 4. 정적 자산 응답
    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);

    // 보안 헤더는 리다이렉트에도 적용
    headers.set(
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload"
    );
    headers.set("x-content-type-options", "nosniff");
    headers.set("x-frame-options", "DENY");
    headers.set("referrer-policy", "strict-origin-when-cross-origin");

    // 3xx는 캐시 헤더를 덮어쓰지 않고 그대로 통과
    // (자산 레이어의 307 등이 immutable로 장기 캐시되는 것을 방지)
    if (response.status >= 300 && response.status < 400) {
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    const contentType = response.headers.get("content-type") || "";

    headers.set(
      "cache-control",
      contentType.includes("text/html")
        ? "public, max-age=3600"
        : "public, max-age=2628000, immutable"
    );

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  },
};
