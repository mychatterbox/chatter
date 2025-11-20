---
kind: article
title: JS 없이 CSS만 사용해서 쉽고 빠르게 reading progress bar 적용하기
author: mychatterbox
pubDate: 2025-11-21
slug: reading-progress-bar
featured: false
draft: false
tags:
  - astro
ogImage: /blog-images/2025/reading-progress-bar.png
description: 자바스크립트없이 css 만으로 페이지 상단에 reading progress bar 를 구현합니다.
keywords:
  - reading progress bar
---

![reading progress bar](../../assets/blog-images/2025/reading-progress-bar_1.png)

개떡같이 말해도 claude.ai 가 이미지를 잘 만들었습니다.  gemini는 너무 화려해서 마치 온라인 강의 혹은 책 표지처럼 만들어주네요.  

Reading progress bar는 현재 페이지의 진행 정도를 보여주는 바인데, PC에서는 항상 오른쪽에 스크롤바가 보이므로 큰 의미가 없지만, 모바일에서는 스크롤바가 사라지므로 상황에 따라 아주 좋은 기능이라 생각합니다.  

```css file="css"
.reading-bar {
  position: fixed; 
  width: 100%;
  height: 5px;
  background-color: #AF3029;
  transform-origin: left;
  animation: fill linear;
  animation-timeline: scroll(); 
}

@keyframes fill {
  from { 
    scale: 0 1;
  }
  to { 
    scale: 1 1;
  }
}
```

위 코드가 전부입니다.  

이제 `reading-bar` 를 html 적절한 곳에 넣기만 하면 됩니다.  

```html file="html"
  ...
  </head>
  
  <body>
    <div class="reading-bar"></div>
    <slot />
  </body>
</html>
```