export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ Worker 동작 확인 로그 (여기!)
    console.log("Worker is running:", url.pathname);

    // ✅ 루트("/") → index.html
    if (url.pathname === "/") {
      return env.ASSETS.fetch(request);
    }

    // ✅ trailing slash 제거 리디렉션 (301)
    if (url.pathname.endsWith("/") && url.pathname !== "/") {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ /page → /page/index.html 로 매핑 (정적 자산 탐색)
    const pageRequest = new Request(url.origin + url.pathname + "/index.html", request);
    let res = await env.ASSETS.fetch(pageRequest);
    if (res.status !== 404) {
      return res;
    }

    // ✅ 일반 파일 (이미지, css 등)
    res = await env.ASSETS.fetch(request);
    if (res.status !== 404) {
      return res;
    }

    // ✅ 404 fallback
    return new Response("404 Not Found", { status: 404 });
  },
};
