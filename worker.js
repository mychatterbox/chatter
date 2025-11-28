export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 리다이렉트 로직 (동일)
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      return Response.redirect(url.toString(), 301);
    }

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
    
    // 캐시 정책
    const contentType = response.headers.get("content-type") || "";
    const cacheControl = contentType.includes("text/html") 
      ? "public, max-age=60" 
      : "public, max-age=31536000, immutable";

    // 새로운 헤더 생성
    const newHeaders = new Headers(response.headers);
    newHeaders.set("cache-control", cacheControl);
    newHeaders.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
    newHeaders.set("x-content-type-options", "nosniff");
    newHeaders.set("x-frame-options", "DENY");
    newHeaders.set("referrer-policy", "strict-origin-when-cross-origin");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }
}