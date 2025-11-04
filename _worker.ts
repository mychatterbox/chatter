export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ 1. /로 끝나지만 루트("/")가 아닌 경우 리디렉션
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 2. 기본 요청 처리
    let response = await env.ASSETS.fetch(request);

    // ✅ 3. HTML fallback (예: /about → /about.html)
    if (response.status === 404 && !url.pathname.includes(".")) {
      const htmlRequest = new Request(url.origin + url.pathname + ".html", request);
      response = await env.ASSETS.fetch(htmlRequest);
    }

    // ✅ 4. 404 fallback (index.html 대체)
    if (response.status === 404) {
      const notFoundRequest = new Request(url.origin + "/404.html", request);
      response = await env.ASSETS.fetch(notFoundRequest);
    }

    return response;
  },
};
