export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let redirect = false;

    // WWW 제거
    if (url.hostname === 'www.chatter.kr') {
      url.hostname = 'chatter.kr';
      redirect = true;
    }

    // Trailing slash 제거
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
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    return new Response(response.body, {
      headers: {
        ...Object.fromEntries(response.headers),
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  }
}