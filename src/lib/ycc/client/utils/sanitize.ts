export function parseAndSanitizeMarkdown(text: string | undefined | null): string {
  if (!text) return '';

  // 1. [보안] XSS 방지를 위해 HTML 특수문자(<, >)를 가장 먼저 이스케이프 처리합니다.
  let safeHtml = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. 멀티라인 코드 블록 처리 (```code```)
  safeHtml = safeHtml.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

  // 3. 인라인 코드 처리 (`code`)
  safeHtml = safeHtml.replace(/`([^`\n]+?)`/g, '<code>$1</code>');

  // 4. 헤더 처리 (###, ####)
  safeHtml = safeHtml.replace(/(?:^|\n)#### ([^\n]+)/g, '<h4>$1</h4>');
  safeHtml = safeHtml.replace(/(?:^|\n)### ([^\n]+)/g, '<h3>$1</h3>');

  // 5. 이미지 처리 (![alt](url))
  safeHtml = safeHtml.replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, url) => {
    const isValidProtocol = /^(https?:\/\/)/i.test(url);
    if (!isValidProtocol) return '';
    return `<img src="${url}" alt="${alt}" loading="lazy" style="max-width: 100%; height: auto;" />`;
  });

  // 6. 링크 처리 ( [text](url) )
  safeHtml = safeHtml.replace(/(<img[^>]*>|!\[.*?\]\(.*?\))|\[(.*?)\]\((.*?)\)/g, (match, imgPart, linkText, url) => {
    if (imgPart) return match;

    const isValidProtocol = /^(https?:\/\/)/i.test(url);
    if (!isValidProtocol) return linkText;

    return `<a rel="noopener noreferrer" data-external-link="true" data-href="${url}" style="cursor: pointer;">${linkText}</a>`;
  });

  // 7. 굵게 (**text**)
  safeHtml = safeHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // 8. 이탤릭 (*text*)
  safeHtml = safeHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 9. 리스트 및 인용구 상태 머신 행 처리
  const lines = safeHtml.split('\n');
  let inList = false;
  let inBlockquote = false;
  const resultLines: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // [수정 분기 1] 사용자가 기호만 입력했거나 빈 인용구 라인(&gt;) 처리
    if (trimmed === '&gt;' || trimmed === '&gt; ') {
      if (inList) { inList = false; resultLines.push('</ul>'); }

      // 인용구 내부에 빈 줄이 지속된다면 블록을 깨지 않고 내부 줄바꿈용 빈 문자열 저장
      if (inBlockquote) {
        resultLines.push('');
      } else {
        // 인용구 밖에서 기호만 나온 경우 일반 텍스트 문자로 취급하여 인용구 시작을 방지
        resultLines.push(line);
      }
      continue;
    }

    // 9-1. 정상적인 인용구 처리 (&gt; 내용)
    if (trimmed.startsWith('&gt; ')) {
      if (inList) { inList = false; resultLines.push('</ul>'); }
      if (!inBlockquote) {
        inBlockquote = true;
        resultLines.push('<blockquote>');
      }
      const content = trimmed.substring(5); // '&gt; ' 제외한 본문만 추출
      resultLines.push(content);
      continue;
    }

    // 9-2. 리스트 처리 (- 목록)
    if (trimmed.startsWith('- ')) {
      if (inBlockquote) { inBlockquote = false; resultLines.push('</blockquote>'); }
      if (!inList) {
        inList = true;
        resultLines.push('<ul>');
      }
      const content = trimmed.substring(2);
      resultLines.push(`<li>${content}</li>`);
      continue;
    }

    // 9-3. 일반 행 처리 (글자가 있거나 완전한 빈 줄)
    if (inBlockquote) { inBlockquote = false; resultLines.push('</blockquote>'); }
    if (inList) { inList = false; resultLines.push('</ul>'); }
    resultLines.push(line);
  }

  // 루프가 끝난 후 덜 닫힌 태그 정리
  if (inBlockquote) resultLines.push('</blockquote>');
  if (inList) resultLines.push('</ul>');

  // 10. [수정 분기 2] 개행(\n) -> <br> 치환 최적화
  // 구조적 HTML 태그들이 열리고 닫히는 경계선 주변에 불필요하게 생성되는 <br> 태그들을 완전히 청소합니다.
  return resultLines.join('\n')
    .replace(/(<\/h3>|<\/h4>|<\/pre>|<\/ul>|<\/li>|<blockquote>|<\/blockquote>)\n/g, '$1')
    .replace(/\n(<\/h3>|<\/h4>|<\/pre>|<\/ul>|<\/li>|<blockquote>|<\/blockquote>)/g, '$1')
    .replace(/\n/g, '<br>');
}