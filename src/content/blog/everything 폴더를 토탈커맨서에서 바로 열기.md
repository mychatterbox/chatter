---
kind: article
title: Everything 검색 결과를 토탈커맨더에서 확인하기
author: mychatterbox
pubDate: 2025-01-19
slug: everything-with-totalcommander
featured: false
draft: false
tags:
  - 윈도우
  - 소프트웨어
ogImage: ""
description: Everything에서 검색된 파일의 위치를 탐색기가 아닌 토탈커맨더의 패널에서 바로 확인하는 방법을 설명합니다.
keywords:
  - everything 토탈커맨더
  - 토탈커맨더 everything
---

아래와 같은 파일을 검색했습니다.

![everything](./blog-images/2025/everything-with-totalcommander_1.png)

#### Everything 기본 설정

- 파일 더블클릭 or <kbd>Enter</kbd> -> 실행
- 파일 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> -> 아무런 기능을 하지 않음
- 경로 클릭 -> 아무런 기능을 하지 않음

#### 설정(일반-검색 결과-'경로 칸을 더블클릭해서 폴더 열기'를 체크) 변경 후 동작

- 경로 더블클릭 or 파일 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> -> 탐색기로 해당 폴더 열기

#### 추가 설정 변경 후 동작

- 경로 더블클릭 or 파일 <kbd>Ctrl</kbd>+<kbd>Enter</kbd> -> 토탈커맨더의 설정된 패널에 파일을 보여주고, 포커스

#### 추가 설정 방법

| ![everything-setting](./blog-images/2025/everything-with-totalcommander_2.png) | ![everything-setting](./blog-images/2025/everything-with-totalcommander_3.png) |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |

#### 입력할 명령

```
 $exec("d:\Programs\All\FileDISK\TotalCommander\totalcmd64.exe" /O /A /R="%1" /P=R)
```

`/O` : 토탈커맨더가 실행중이면 해당 토탈커맨더를 사용  
`/A` : 토탈커맨더가 실행중이 아니면 토탈커맨더를 실행  
`/R=` : 오른쪽 패널에 표시  
`/P=R` : 오른쪽 패널에 포커스

[토탈커맨더 parameters 위키](https://www.ghisler.ch/wiki/index.php/Command_line_parameters)에서는 /O 옵션과 /P= 옵션을 같이 사용할 수 없다고 되어 있으나, 옛 문서인지 몰라도 정상적으로 작동합니다.
