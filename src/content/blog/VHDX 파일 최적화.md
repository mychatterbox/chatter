---
kind: article
title: Optimize-VHD를 이용해서 VHDX 파일을 최적화하는 방법
author: mychatterbox
pubDate: 2025-11-12
slug: optimize-vhd
featured: false
draft: false
tags:
  - 윈도우
  - 소프트웨어
ogImage: ""
description: 너무 커진 VHD(X)파일을 defrag 와 Optimize-VHD 명령어를 이용해서 크기를 줄이는 방법을 설명합니다.
keywords:
  - Optimize-VHD
  - vhd 최적화
  - vhdx 최적화
  - vhd 용량 최적화
---

vhdx 파일을 Native 부팅해서 사용하고 있습니다.  
이 파일로 부팅하면 C 드라이브의 용량이 약 60GB 인데, 오래 사용하다보니 VHDX 파일의 용량이 약 110GB 까지 커졌습니다.  
Optimize-VHD 명령어를 이용해서 용량을 조금 줄여보겠습니다.  
필요한 것은 Hyper-V 기능을 켜는 것과 Powershell 을 실행할 수 있는 다른 윈도우가 필요합니다.  
제가 가진 PE는 Powershell 을 실행할 수 없는 PE 라서, 부득이하게 현재 사용중인 vhdx 파일의 복사본을 만들고, BCD에 등록하고 이 윈도우로 부팅해서 작업했습니다.  

#### 순서대로 진행합니다.

>1. 평소 사용하던, 최적화 하고 싶은 VHDX 파일로 부팅한 상태에서 아래 명령어로 최적화 합니다.
>     ```
>     PS C:\Windows\system32> defrag C: /L /V
>     ```  
>2. 컴퓨터를 재시작이 아닌 <mark>종료</mark>합니다.  
> 
>3. 임시 윈도우로 부팅합니다.  
>혹시 Hyper-V 기능을 꺼놓은 상태라면 다시 기능을 켭니다.  
>Windows 기능 켜기/끄기 창을 열고, Hyper-V 아래 Hyper-V 관리 도구와 Hyper-V 플랫폼 2가지 모두 체크합니다.  
>재부팅을 강제하므로 다시 임시 윈도우로 재부팅합니다.
> 
>4. 관리자 권한으로 Powershell 을 실행한 뒤 아래 명령어를 본인의 경로와 파일명에 맞게 수정하고 실행합니다.
> 
>     ```
>     PS C:\Windows\system32> Optimize-VHD -Path "i:\VHDX\windows 11.vhdx" -Mode Full
>     ```
> 
>5. windows 11.vhdx 파일이 최적화 되었으므로, 다시 자식 파일을 만들고 백업을 해둡니다.

저의 경우는 110GB --> 92GB 정도로 파일 크기가 줄었습니다.