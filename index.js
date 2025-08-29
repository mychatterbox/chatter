// index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 루트 경로가 아니면서 슬래시로 끝나는 경우
    if (url.pathname !== "/" && url.pathname.endsWith("/")) {
      const newPath = url.pathname.replace(/\/+$/, ""); // 여러 개의 슬래시도 제거
      const newUrl = `${url.origin}${newPath}${url.search}${url.hash}`;
      
      // 301 영구 이동
      return Response.redirect(newUrl, 301);
    }
    
    // 정적 파일 서빙
    return env.ASSETS.fetch(request);
  }
}