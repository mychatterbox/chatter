export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ /로 끝나지만 루트가 아닐 경우 영구 리디렉션
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 정적 자산 요청 처리 (dist 디렉터리의 파일 제공)
    try {
      // env.ASSETS가 있으면 그대로 사용
      if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
        return await env.ASSETS.fetch(request);
      }

      // 없으면 fallback — 직접 fetch (Cloudflare Pages처럼)
      return await fetch(request);
    } catch (err) {
      return new Response("Worker execution error: " + (err as Error).message, { status: 500 });
    }
  },
};
