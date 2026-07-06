export function applyMarkdownLineBreaks(text: string): string {
  let inCodeFence = false;

  return text
    .split('\n')
    .map(line => {
      const trimmed = line.trim();

      // ``` 펜스 라인: 상태만 토글하고 공백은 붙이지 않음
      if (trimmed.startsWith('```')) {
        inCodeFence = !inCodeFence;
        return line;
      }

      // 코드 블록 내부: 원본 그대로 유지
      if (inCodeFence) {
        return line;
      }

      return line.length > 0 && !line.endsWith('  ') ? line + '  ' : line;
    })
    .join('\n');
}

export function parseAndSanitizeMarkdown(text: string | undefined | null): string {
  if (!text) return '';

  // 1. [보안] XSS 방지를 위해 HTML 특수문자(<, >)를 가장 먼저 이스케이프 처리합니다.
  let safeHtml = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. 멀티라인 코드 블록 처리 (```code```)
  // [수정] 코드 블록 내용을 임시로 격리하고 보관하여, 최종 단계의 <br> 강제 치환 영역에 걸리지 않도록 방어합니다.
  const codeBlocks: string[] = [];
  safeHtml = safeHtml.replace(/```([\s\S]*?)```/g, (_, codeContent) => {
    // [방어 코드] 입력 단계에서 붙었을 수 있는 줄 끝 공백(마크다운 강제 개행용 공백 등)을 제거합니다.
    const withoutTrailingSpaces = codeContent.replace(/[ \t]+(?=\n)/g, '');
    // 앞뒤에 붙은 불필요한 빈 개행(\n)을 확실하게 싹 정리합니다.
    const trimmedCode = withoutTrailingSpaces.replace(/^\n+|\n+$/g, '');
    
    // 코드 내부의 \n이 10번 단계에서 <br>로 강제 변경되지 않도록 플레이스홀더(자리표시자)를 생성합니다.
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${codeBlocks.length}__`;
    codeBlocks.push(`<pre><code>${trimmedCode}</code></pre>`);
    return placeholder;
  });

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
  safeHtml = safeHtml.replace(/\*([^\*\n]+?)\*/g, '<em>$1</em>');

  // 9. 리스트 및 인용구 상태 머신 행 처리
  const lines = safeHtml.split('\n');
  let inList = false;
  let inBlockquote = false;
  const resultLines: string[] = [];

  for (let line of lines) {
    const trimmed = line.trim();

    // 9-1. 기호만 입력했거나 빈 인용구 라인(&gt;) 처리
    if (trimmed === '&gt;' || trimmed === '&gt; ') {
      if (inList) { inList = false; resultLines.push('</ul>'); }
      if (inBlockquote) {
        resultLines.push(''); 
      } else {
        resultLines.push(line);
      }
      continue;
    }

    // 9-2. 정상적인 인용구 처리 (&gt; 내용)
    if (trimmed.startsWith('&gt; ')) {
      if (inList) { inList = false; resultLines.push('</ul>'); }
      if (!inBlockquote) {
        inBlockquote = true;
        resultLines.push('<blockquote>');
      }
      const content = trimmed.substring(5);
      resultLines.push(content);
      continue;
    }

    // 9-3. 리스트 처리 (- 목록)
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

    // 9-4. 일반 행 처리 (글자가 있거나 완전한 빈 줄)
    if (inBlockquote) { inBlockquote = false; resultLines.push('</blockquote>'); }
    if (inList) { inList = false; resultLines.push('</ul>'); }
    resultLines.push(line);
  }

  if (inBlockquote) resultLines.push('</blockquote>');
  if (inList) resultLines.push('</ul>');

  // 10. 엔터 기반 개행(<br>) 최종 조율 및 청소
  let finalHtml = resultLines.join('\n')
    // 블록 구조적 태그 주변의 불필요한 \n들을 청소합니다.
    .replace(/(<\/h3>|<\/h4>|<blockquote>|<\/blockquote>|<ul>|<\/ul>|<li>|<\/li>)\n/g, '$1')
    .replace(/\n(<h3>|<h4>|<blockquote>|<\/blockquote>|<ul>|<\/ul>|<li>|<\/li>)/g, '$1')
    // 일반 텍스트 사이의 줄바꿈만 안전하게 <br>로 변경합니다.
    .replace(/\n/g, '<br>');

  // 11. [수정 완료] 격리해두었던 실제 코드 블록 데이터를 원상복구 시켜 결합합니다.
  codeBlocks.forEach((codeBlock, index) => {
    const placeholder = `__CODE_BLOCK_PLACEHOLDER_${index}__`;
    // 복구 시 주변에 잉여 <br> 태그가 감싸지지 않도록 정돈하여 완벽히 합체시킵니다.
    finalHtml = finalHtml
      .replace(new RegExp(`<br>\\s*${placeholder}`, 'g'), placeholder)
      .replace(new RegExp(`${placeholder}\\s*<br>`, 'g'), placeholder)
      .replace(placeholder, codeBlock);
  });

  return finalHtml;
}