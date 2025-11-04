export default {
  async fetch(request: Request, env: Record<string, any>, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // ✅ 301 영구 리디렉션: /로 끝나지만 루트는 아닐 경우
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 정적 자산 및 HTML 파일 서빙
    return env.ASSETS.fetch(request);
  },
};