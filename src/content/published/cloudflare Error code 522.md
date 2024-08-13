---
kind: note
title: Cloudflare 에러 코드 522
author: mychatterbox
pubDate: 2024-08-13
slug: cloudflare-errorcode-522
featured: false
draft: false
tags:
  - astro
ogImage: ""
description: 클라우드플레어에서 새로운 사이트를 빌드하고 도메인연결했는데 Error code 522 로 접속이 안될 때
keywords:
  - error code 522
  - 클라우드플레어 522
---

Cloudflare 에서  새로운 사이트를 빌드하고 도메인을 연결하면 Error code 522 를 만나게 됩니다.  
신난 마음에 성급해서 생긴 결과이며 쉽게 수정할 수 있습니다.  
아마도 당신은 CloudFlare 를 처음 이용하는 것이 아니라, 원래 도메인을 하나 가기고 있었을 것입니다.   


1. Workers 및 Pages 에서 `현재 도메인`에 연결된 `페이지`를 클릭, 상단의 '사용자 설정 도메인' 탭을 클릭하고, 오른쪽 ... 에서 `도메인 제거`를 해줍니다.  
2. `새로 만든 페이지` 제목 클릭, 상단의 '사용자 설정 도메인' 탭을 클릭하고, `사용자 설정 도메인 설정`을 눌러 보유한 도메인 입력을 해줍니다.
3. 잠시 후 사이트가 정상적으로 보여야 합니다.