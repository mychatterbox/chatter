export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ 1. 슬래시 리디렉션: 루트("/")는 제외
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 2. 기본 요청
    let response = await env.ASSETS.fetch(request);

    // ✅ 3. .html fallback (예: /post → /post.html)
    if (response.status === 404 && !url.pathname.includes(".")) {
      const htmlUrl = new URL(url.pathname + ".html", request.url);
      response = await env.ASSETS.fetch(new Request(htmlUrl, request));
    }

    // ✅ 4. index.html fallback (루트 페이지 등)
    if (response.status === 404 && !url.pathname.includes(".")) {
      const indexUrl = new URL(url.pathname + "/index.html", request.url);
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    // ✅ 5. 그래도 없으면 404.html 반환
    if (response.status === 404) {
      const notFoundUrl = new URL("/404.html", request.url);
      response = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    }

    return response;
  },
};
