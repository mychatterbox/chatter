export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ 끝에 /가 있고 루트(/)가 아니면 → 슬래시 제거하고 301 리디렉션
    if (url.pathname.endsWith('/') && url.pathname !== '/') {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    // ✅ 정적 파일을 그대로 서빙 (dist/에서)
    return env.ASSETS.fetch(request, env, ctx);
  }
}