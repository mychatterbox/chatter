export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Trailing slash 제거 (루트 제외)
    if (url.pathname.endsWith('/') && url.pathname.length > 1) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }
    
    // 원래 요청 처리
    return env.ASSETS.fetch(request);
  }
}