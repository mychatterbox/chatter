export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // WWW 제거 (예: www.chatter.kr → chatter.kr)
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      return Response.redirect(url.toString(), 301);
    }

    // Trailing slash 제거 (예: /about/ → /about)
    const hasFileExtension = /\.[a-zA-Z0-9]{2,4}$/.test(url.pathname.split('/').pop() || '');
    const shouldRemoveTrailingSlash =
      url.pathname.endsWith('/') &&
      url.pathname.length > 1 &&
      !hasFileExtension;

    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // 정적 자산 응답 가져오기
    const response = await env.ASSETS.fetch(request);

    // 캐시 정책 설정
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      // HTML은 짧게 캐시
      response.headers.set("cache-control", "public, max-age=60");
    } else {
      // 정적 자산은 길게 캐시
      response.headers.set("cache-control", "public, max-age=31536000, immutable");
    }

    // 보안 헤더 추가
    response.headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("x-content-type-options", "nosniff");
    response.headers.set("x-frame-options", "DENY");
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin");

    // 원본 Response 그대로 반환 (⚡ 스트리밍/본문 안전)
    return response;
  }
}