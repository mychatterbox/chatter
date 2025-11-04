// worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let redirect = false;
    
    // WWW 제거
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      redirect = true;
    }
    
    // Trailing slash 제거 (루트 및 정적 파일 제외)
    const shouldRemoveTrailingSlash = 
      url.pathname.endsWith('/') && 
      url.pathname.length > 1 &&
      !url.pathname.includes('.');
    
    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      redirect = true;
    }
    
    if (redirect) {
      // 301 Permanent Redirect로 명시적 지정
      return Response.redirect(url.toString(), 301);
    }
    
    return env.ASSETS.fetch(request);
  }
}