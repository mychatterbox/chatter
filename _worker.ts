export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ 루트("/")는 유지
    if (url.pathname === "/") {
      return env.ASSETS.fetch(request);
    }

    // ✅ trailing slash 제거 리디렉션 (301)
    if (url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ /page 요청 시 실제 dist 내 /page/index.html 로 매핑
    try {
      const pageUrl = new URL(url.pathname + "/index.html", request.url);
      const res = await env.ASSETS.fetch(new Request(pageUrl, request));
      if (res.status !== 404) return res;
    } catch (e) {
      // fallback 처리
    }

    // ✅ 마지막 fallback (일반 요청)
    return env.ASSETS.fetch(request);
  },
};
