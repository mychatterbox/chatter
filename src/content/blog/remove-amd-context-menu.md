---
kind: note
title: 윈도우 바탕화면 우클릭 메뉴에서 AMD adrenaline 제거
author: mychatterbox
pubDate: 2025-12-01
slug: remove-amd-context-menu
featured: false
draft: false
tags:
  - 윈도우
ogImage: ""
description: 바탕화면 우클릭 메뉴에서 아드레날린 메뉴를 제거하는 방법입니다.
keywords:
  - 우클릭메뉴 아드레날린 제거
  - 아드레날린 컨텍스트 메뉴 제거
---

어떤 이유로든 우클릭 메뉴(Context Menu) 에서 AMD adrenaline 메뉴를 제거하고 싶을 수 있습니다.  

PowerShell 을 **관리자 권한**으로 열고 아래 명령어를 실행합니다.  

```ps
Get-AppxPackage -AllUsers AdvancedMicroDevicesInc-RSXCM | Remove-AppxPackage -AllUsers
```

재부팅 하거나 탐색기를 재실행 합니다.  

>탐색기 재실행하는 방법  
>작업관리자 - 프로세스 탭 - 앱 or 백그라운드 프로세스 - Windows 탐색기를 마우스 우클릭하고 다시 시작 선택  


해결되지 않을 경우 다음 게시물을 참고해서 하나씩 시도해봅니다.  

https://www.reddit.com/r/AMDHelp/comments/10japim/how_to_remove_amd_context_menu_once_and_for_all/