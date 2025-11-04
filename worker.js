// worker.jsexport default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let redirect = false;
    
    // 1. WWW 제거 (www.chatter.kr -> chatter.kr)
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      redirect = true;
    }
    
    // 2. Trailing slash 제거 (/path/ -> /path)
    // 루트 경로 ('/') 제외, 파일 확장자 있는 URL 제외
    const isRoot = url.pathname === '/';
    // 쿼리 파라미터나 해시(#) 앞의 경로에 확장자가 있는지 확인
    const hasExtension = /\.[a-zA-Z0-9]{2,4}(\?|#|$)/.test(url.pathname); 
    
    const shouldRemoveTrailingSlash = 
      url.pathname.endsWith('/') && 
      !isRoot &&
      !hasExtension;
    
    if (shouldRemoveTrailingSlash) {
      // 끝의 슬래시만 제거합니다.
      url.pathname = url.pathname.slice(0, -1);
      // 쿼리나 해시는 url 객체에 이미 유지되지만, 명시적으로 리다이렉트 대상 URL을 구성합니다.
      redirect = true;
    }
    
    // 리다이렉트가 필요한 경우 301 영구 이동 응답 반환
    if (redirect) {
      // Response.redirect()는 기본적으로 302/307을 사용하지만, 두 번째 인수로 301을 명시합니다.
      // url.toString()은 https://chatter.kr/ssd-pe-uefi-boot 와 같은 
      // 완전한 URL (Absolute URL)을 반환합니다.
      return Response.redirect(url.toString(), 301); 
    }
    
    // 리다이렉트가 필요 없는 경우, Cloudflare Workers의 정적 자산 서빙을 호출합니다.
    return env.ASSETS.fetch(request);
  }}