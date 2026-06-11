---
kind: note
title: OneDrive 변경 내용 처리 중 오류 해결하기
author: mychatterbox
pubDate: 2025-03-04
updatedDate: 2026-06-12
slug: onedrive-stuck
featured: false
draft: false
tags:
  - 소프트웨어
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

본인의 <mark>원드라이브 설치 위치에 맞게 수정</mark>하고 <kbd>Win</kbd>+<kbd>R</kbd> 실행창에 입력합니다.  
OneDrive 를 다시 실행해보고 같은 오류가 다시 표시되는지 확인합니다.

보통 권한 문제가 흔합니다.  
문제가 되는 폴더 우클릭 후 속성 - 보안 탭에서 users 사용자에 '모든 권한'을 주면 해결됩니다.  