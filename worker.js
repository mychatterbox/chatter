export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/googled1d1ec5d34fbe362.html") {
      return new Response("google-site-verification: googled1d1ec5d34fbe362.html", {
        headers: { "content-type": "text/html" }
      });
    }

    if (url.pathname === "/navered165ef0969293dac6988ef5b181e332.html") {
      return new Response("naver-site-verification: navered165ef0969293dac6988ef5b181e332.html", {
        headers: { "content-type": "text/html" }
      });
    }



    // Trailing slash 제거
    const hasFileExtension = /\.[a-zA-Z0-9]{2,4}$/.test(url.pathname.split('/').pop() || '');
    const shouldRemoveTrailingSlash =
      url.pathname.endsWith('/') &&
      url.pathname.length > 1 &&
      !hasFileExtension;

    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // 정적 자산 응답
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    // 캐시 정책
    const cacheControl = contentType.includes("text/html")
      ? "public, max-age=60"
      : "public, max-age=31536000, immutable";

    // 헤더 복사 후 보강
    const newHeaders = new Headers(response.headers);
    newHeaders.set("cache-control", cacheControl);
    newHeaders.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
    newHeaders.set("x-content-type-options", "nosniff");
    newHeaders.set("x-frame-options", "DENY");
    newHeaders.set("referrer-policy", "strict-origin-when-cross-origin");

    // 새 Response 반환
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
}