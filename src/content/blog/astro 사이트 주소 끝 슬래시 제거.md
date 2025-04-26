---
kind: note
title: cloudflare 사이트에 배포하는 astro 정적사이트 주소 끝 슬래시 제거하기
author: mychatterbox
pubDate: 2024-03-03
slug: trailingSlash-remove
featured: false
draft: false
tags:
  - astro
ogImage: ""
description: cloudflare 로 배포한 astro 사이트 주소 끝 슬래시 제거하기
keywords:
  - trailingSlash
  - cloudflare trailingSlash
  - 후행슬래시 제거
---

cloudflare 로 배포하는 astro 사이트의 후행 슬래시 제거가 잘 안되나요?  
build format을 file로 설정해도 후행 슬래시가 잘 제거되지만 canonicalURL이 문제될 수 있습니다.

아래 설정을 시도해봅시다.

astro.config

```astro
  export default defineConfig({
  trailingSlash: "never",
    build: {
    format: 'preserve',
    },
  ......
  });
```
