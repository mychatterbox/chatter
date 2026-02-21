---
kind: note
title: 동적 VHDX 파일을 더 작은 크기의 고정 VHDX로 변경하기
author: mychatterbox
pubDate: 2026-02-21
slug: vhdx-convert-resize
featured: false
draft: false
tags:
  - 윈도우
ogImage: ""
description: Dynamic VHDX 파일을 더 작은 FIXED VHDX로 바꾸고 싶을 때, 디스크 복제 기능을 사용해도 됩니다.  
keywords:
  - 동적 VHDX 파일을 고정 VHDX로 변경하기
  - 동적 VHDX 축소
---

제가 사용 중인 windows 11.vhdx 파일은 동적 크기 150GB 였습니다.  
실제 용량은 60GB 정도인데, 디스크 크기는 약 100GB 정도 차지하고, 자식이 항상 150GB라서 용량이 낭비되는 것 같아 100GB로 줄이고 고정 크기로 변경하고 싶었습니다.  
검색해 보면 Resize-VHD, Convert-VHD 같은 파워쉘 명령어 예시가 있는데, 제 경우는 축소할 수 있는 용량이 3.7GB 밖에 되지 않았습니다.  

이런 상황이라면 원본 파일을 수정하는 것이 불가능한 것 같아서 다른 방법을 사용했습니다.  
항상 원본 vhdx 파일은 백업해둡니다.  
당연히 PE 혹은 다른 윈도우로 부팅한 상태에서 작업합니다.  

디스크 관리에서 100GB 짜리 VHDX를 만듭니다.  
windows 11.vhdx 파일도 탑재합니다.  
AOMEI Partition Assistant 같은 파티션 툴을 이용해서, 탑재된 windows 11.vhdx 디스크를 clone 해서 100GB 짜리 VHDX로 복제합니다.  
150GB -> 100GB 이지만 문제없이 복제됩니다.  
bcd를 새 vhdx 파일로 수정한 뒤 부팅하니 잘 작동합니다.  