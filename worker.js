// worker.js (최종 수정 버전)
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let redirect = false;
    
    // 1. WWW 제거 (www.chatter.kr -> chatter.kr)
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      redirect = true;
    }
    
    // 2. Trailing slash 제거 (/path/ -> /path)
    const isRoot = url.pathname === '/';
    const hasExtension = /\.[a-zA-Z0-9]{2,4}(\?|#|$)/.test(url.pathname); 
    
    const shouldRemoveTrailingSlash = 
      url.pathname.endsWith('/') && 
      !isRoot &&
      !hasExtension;
    
    if (shouldRemoveTrailingSlash) {
      url.pathname = url.pathname.slice(0, -1);
      redirect = true;
    }
    
    // 리다이렉트가 필요한 경우 301 영구 이동 응답 반환
    if (redirect) {
      // 🚨 핵심 수정: Response.redirect() 대신 new Response로 직접 Location 헤더와 301 상태를 설정
      return new Response(null, {
        status: 301,
        headers: {
          // url.toString()을 사용하여 'https://chatter.kr/path'와 같은 절대 경로를 반환합니다.
          'Location': url.toString(), 
          // 브라우저 및 엣지 캐시가 이 리다이렉트 응답을 캐시하지 않도록 설정
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' 
        }
      });
    }
    
    // 리다이렉트가 필요 없는 경우, Cloudflare Workers의 정적 자산 서빙을 호출합니다.
    return env.ASSETS.fetch(request);
  }
}