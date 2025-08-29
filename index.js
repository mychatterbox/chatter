export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 루트('/')는 제외하고, 끝이 '/'로 끝나는 경우만 처리
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      // 마지막 '/' 제거
      const newPath = url.pathname.replace(/\/$/, "");
      const newUrl = `${url.origin}${newPath}${url.search}`;
      return Response.redirect(newUrl, 301);
    }

    // 나머지 요청은 정적 파일 처리
    return env.ASSETS.fetch(request);
  }
}