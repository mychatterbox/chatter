export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ /로 끝나지만 루트("/")가 아닌 경우 301 리디렉션
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 정적 자산 기본 처리
    let response = await env.ASSETS.fetch(request);

    // ✅ .html fallback (예: /about → about.html)
    if (response.status === 404 && !url.pathname.includes(".")) {
      const htmlUrl = new URL(url.pathname + ".html", request.url);
      response = await env.ASSETS.fetch(new Request(htmlUrl, request));
    }

    return response;
  },
};
