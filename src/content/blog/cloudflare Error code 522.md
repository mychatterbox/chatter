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

Cloudflare 에서 새로운 사이트를 빌드하고 내 도메인에 접속했는데 Error code 522 !  
신난 마음에 성급해서 생긴 결과이며 쉽게 수정할 수 있습니다.  
아마도 당신은 Cloudflare 를 처음 이용하는 것이 아니라, 원래 Page를 하나 이상 가지고 있었고, 새로 빌드한 페이지가 만족스러워서 도메인에 연결하려는 상황일 것입니다.

1. Workers 및 Pages 에서 현재 <mark>도메인에 연결된 페이지를 클릭</mark>, 상단의 <mark>사용자 설정 도메인</mark> 탭을 클릭하고, 오른쪽 ... 에서 <mark>도메인 제거</mark>를 해줍니다.
2. <mark>새로 만든 페이지</mark> 제목 클릭, 상단의 <mark>사용자 설정 도메인</mark> 탭을 클릭하고, <mark>사용자 설정 도메인 설정</mark>을 눌러 보유한 도메인 입력을 해줍니다.
3. 잠시 후 사이트가 정상적으로 보여야 합니다.
