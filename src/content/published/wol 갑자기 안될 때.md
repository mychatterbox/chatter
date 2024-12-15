---
kind: note
title: 잘 되던 wake on lan 기능이 안될 때
author: mychatterbox
pubDate: 2024-12-15
slug: wol-fast-startup
featured: false
draft: false
tags:
  - 윈도우
ogImage: ""
description: 잘 되던 WOL 기능이 안될 때 확인해야될 것
keywords:
  - 24H2 wol
  - wol 빠른시작
  - 빠른시작켜키
---

미니PC를 윈도우 24H2로 업데이트하니 WOL 기능이 안되네요.  
빠른 시작 켜기 옵션이 활성화된 것 같습니다.  

검색(혹은 윈도우키 + R) - powercfg.cpl - 전원 단추 작동 설정 - 현재 사용할 수 없는 설정 변경 클릭 - `빠른 시작 켜키를 비활성화`  

![빠른시작켜기](../../assets/blog-images/2024/wol-fast-startup.png)