// worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let redirect = false;

    // WWW 제거
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      redirect = true;
    }

    // Trailing slash 제거 (루트 및 파일 확장자 있는 URL 제외)
    const hasFileExtension = /\.[a-zA-Z0-9]{2,4}$/.test(url.pathname.split('/').pop() || '');
    const shouldRemoveTrailingSlash =
      url.pathname.endsWith('/') &&
      url.pathname.length > 1 &&
      !hasFileExtension;

    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      redirect = true;
    }

    if (redirect) {
      return Response.redirect(url.toString(), 301);
    }

    // 정적 자산 응답 가져오기
    const response = await env.ASSETS.fetch(request);

    // Content-Type 확인
    const contentType = response.headers.get("content-type") || "";

    // HTML과 정적 자산을 구분해서 캐시 헤더 적용
    let cacheControl = "public, max-age=31536000, immutable";
    if (contentType.includes("text/html")) {
      cacheControl = "public, max-age=60";
    }

    return new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers),
        "cache-control": cacheControl,
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        "x-content-type-options": "nosniff",
        "x-frame-options": "DENY",
        "referrer-policy": "strict-origin-when-cross-origin"
      }
    });
  }
}