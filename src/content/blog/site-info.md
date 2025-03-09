---
kind: "article"
title: "사이트 정보"
description: ""
pubDate: 2025-01-02
slug: site-info
---

### 알림
이 블로그는 제가 만든 것이 아닙니다.  
저는 무슨 개발자도 아니고 그냥 일반인이라 아무것도 모릅니다.  

```
pub.sort((a, b) => b.data.pubDate!.getTime() - a.data.pubDate!.getTime());  
{pub.map((entry) => <FeedItem entry={entry} />)}
```

이런 코드는 대략 단어로 느낌만 핥는 수준입니다.  
그래서 댓글시스템도 못 달고 있습니다.  

[https://github.com/mrmcc3/vibing-dev][repo] 

위 블로그가 astro v4 를 기준으로 만들어졌을 때를 기본으로 해서 ChatGPT 4, Claude 3.5 sonnet 등 AI 의 도움을 받아 조금씩 수정하면서 astro v5 까지 업데이트했고, 그 이후는 deepseek 가 수정하고 있습니다.  
~~코파일럿은 수준이 많이 떨어집니다.~~  
하지만 VS code와 Github의 도움을 많이 받고 있으므로 MS에게도 감사드립니다. 배당금도 잘 나오더라구요.  
원 제작자분은 더 미니멀하게 디자인과 구조를 갈아엎은 상태입니다.  

svelte 도 비교적 최근 대규모 버전업이 된 것 같은데, svelte 도 같이 건드리기엔 일이 커질 듯 하여, 임시로 어거지로 돌아가게는 해두었습니다.  
astro 만으로도 다크모드 구현이 되긴 하지만, 원 제작자는 svelte 로 구현했는데, 모바일 기기의 상단 주소표시줄 색상을 컨트롤하기 위함이 아닐까 싶습니다.  
Github에서 astro 만으로 구현한 수백개의 블로그를 봤는데, 상단 주소표시줄과 본문의 색상 설정이 아직은 좀 미흡한 것 같습니다.

[RSS Feed](/rss.xml) 는 이렇게 되어 있는데, 잘 될런지? 요즘도 해외에선 RSS 쓰나보죠?

### 라이센스
Except where otherwise noted, content on this site is licensed under [CC BY 4.0][cc].  
Code snippets and the code for the site itself are [MIT Licensed][mit].

원 제작자의 라이센스는 위와 같은데, 대략 콘텐츠는 건드리지 말고 코드는 알아서 잘 갖다쓰라는 의미인 것 같습니다.  
다만, 사이트 잘 보이는 곳에 원 제작자를 표시해야겠지요.  
아마 github 에서 공개 설정으로 해두고 써야될걸요?  

제 코드도 혹시라도 쓰실 분은 마음대로 갖다 쓰세요.  
폰트, 색상 설정은 global.css, prose.astro, tailwind.config.cjs 파일을 수정하면 됩니다.  


### 출처

- Icons on the site are [heroicons][icons] & [tablericons][tabler]
- Fonts are [Pretendard][sans] and [Berkeley Mono][mono]
- Site is built using [Astro][astro] and [Tailwind CSS][tailwind]




from : [https://github.com/mrmcc3/vibing-dev][repo]  
to : [https://github.com/mychatterbox/chatter][repo2]


[cc]: https://creativecommons.org/licenses/by/4.0/
[mit]: https://github.com/mrmcc3/vibing-dev/blob/main/LICENSE
[repo]: https://github.com/mrmcc3/vibing-dev
[repo2]: https://github.com/mychatterbox/chatter
[icons]: https://github.com/tailwindlabs/heroicons
[tabler]: https://tabler-icons.io/
[sans]: https://github.com/orioncactus/pretendard
[mono]: https://berkeleygraphics.com/typefaces/berkeley-mono/
[astro]: https://astro.build/
[tailwind]: https://tailwindcss.com/
[astro-paper]:https://astro-paper.pages.dev/