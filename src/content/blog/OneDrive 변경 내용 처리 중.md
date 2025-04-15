---
kind: note
title: OneDrive 변경 내용 처리 중
author: mychatterbox
pubDate: 2025-03-04
slug: onedrive-stuck
featured: false
draft: false
tags:
  - 프로그램
ogImage: ""
description: OneDrive "변경 내용 처리 중" 상태가 계속 되면...
keywords:
  - 원드라이브 변경내용처리중
  - onedrive 변경내용 처리 중
---

OneDrive를 업데이트했거나, 계정이름을 변경했거나, 원드라이브 폴더 내에 특이한 파일이 있다거나 등등 여러 이유로 무한 "변경 내용 처리 중" 상태에 빠지는 경우가 있습니다.  
<mark>작업 관리자 - 자세히 - OneDrive.exe 파일 우클릭 - 파일 위치 열기</mark>로 OneDrive.exe 파일의 위치를 확인한 뒤  
```
"C:\Program Files\Microsoft OneDrive\onedrive.exe" /reset
```
본인의 `원드라이브 설치 위치에 맞게 수정`하고 <kbd>Win</kbd>+<kbd>R</kbd> 실행창에 입력합니다.  
정상적으로 /reset 되면 OneDrive가 자체적으로 초기화하고 오류가 있다면 무슨 오류인지 보여주므로 해결합시다.