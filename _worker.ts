export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ trailing slash 제거 (루트 제외)
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 모든 요청은 Worker가 직접 정적 자산에서 가져오게 함
    const response = await env.ASSETS.fetch(url.toString(), request);

    // 정적 자산이 없을 경우 404 대신 index.html로 fallback
    if (response.status === 404) {
      return env.ASSETS.fetch("https://chatter.kr/index.html");
    }

    return response;
  },
};
