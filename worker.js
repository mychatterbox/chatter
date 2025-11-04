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
    
    // Trailing slash 제거 (루트 및 파일 확장자 있는 URL 제외)
    const hasFileExtension = /\.[a-zA-Z0-9]{2,4}$/.test(url.pathname.split('/').pop() || '');
    const shouldRemoveTrailingSlash = 
      url.pathname.endsWith('/') && 
      url.pathname.length > 1 &&
      !hasFileExtension;
    
    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      redirect = true;
    }
    
    if (redirect) {
      return Response.redirect(url.toString(), 301); // 301 명시적 지정
    }
    
    return env.ASSETS.fetch(request);
  }
}