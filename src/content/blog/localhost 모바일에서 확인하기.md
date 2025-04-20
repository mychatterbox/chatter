---
kind: note
title: Astro localhost:4321 모바일 미리보기
author: mychatterbox
pubDate: 2025-03-09
slug: astro-localhost-on-mobile
featured: false
draft: false
tags:
  - astro
ogImage: /blog-images/2025/astro-localhost-on-mobile.png
description: astro 개발 localhost 모바일로 확인하기
keywords:
  - localost 모바일에서
  - astro mobile localhost
---

모바일에서 localhost 접속하는 방법을 검색해봤는데 무슨 같은 WiFi에 접속해서 디펜더에서 뭐를 설정하고...  
2025년에도 이렇게 복잡하게 해야 되나?  

astro 만 가능한지는 모르겠지만 아무런 설정을 하지 않아도 됩니다.  

```
npx astro dev -- --host
```

![astro-localhost-on-mobile](../../assets/blog-images/2025/astro-localhost-on-mobile.png)