export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ 301 영구 리디렉션으로 고정
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301); // 👈 307 → 301 명시
    }

    let response = await env.ASSETS.fetch(request);

    if (response.status === 404 && !url.pathname.includes(".")) {
      const htmlUrl = new URL(url.pathname + ".html", request.url);
      response = await env.ASSETS.fetch(new Request(htmlUrl, request));
    }

    if (response.status === 404 && !url.pathname.includes(".")) {
      const indexUrl = new URL(url.pathname + "/index.html", request.url);
      response = await env.ASSETS.fetch(new Request(indexUrl, request));
    }

    if (response.status === 404) {
      const notFoundUrl = new URL("/404.html", request.url);
      response = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    }

    return response;
  },
};
