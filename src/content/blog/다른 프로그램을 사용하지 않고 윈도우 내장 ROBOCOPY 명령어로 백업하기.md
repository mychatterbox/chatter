---
kind: article
title: 다른 프로그램을 사용하지 않고 윈도우 내장 ROBOCOPY 명령어로 백업하기
author: mychatterbox
pubDate: 2024-05-25
slug: robocopy-backup
featured: false
draft: false
tags:
  - 윈도우
ogImage: ""
description: robocopy 를 이용한 백업 방법을 간단하게 설명합니다.
keywords:
  - robocopy 백업
---

중요한 파일들을 백업하려고 이런저런 프로그램들을 찾아서 테스트 해보지만 무언가 하나씩 마음에 들지 않습니다.  
사용하던 [Syncthing](https://syncthing.net/) 프로그램이 점점 마음에 들지 않습니다.  
앞으로는 윈도우에 내장된 명령어인 robocopy 를 이용해 백업하기로 했습니다.  
코드를 수정해야 되는데 잘 모르겠으면 ai 에게 물어보시면 아주 잘 고쳐줍니다.  

---

### 파워쉘 코드와 설명  

> [!IMPORTANT|hide]
> ps1 스크립트는 UTF-8 (BOM) 혹은 ANSI 형식으로 저장합니다.  
> 폴더 위치를 수정하세요.  

```txt file="robocopy-backup.ps1" expanded

# ==========================================
# 1. 공통 설정 및 백업 데이터 정의
# ==========================================
$opt = @("/mir", "/r:2", "/w:1", "/NFL", "/NDL")
$rdate = Get-Date -Format "yyyy-MM-dd"
$summaryLogDir = "d:\OneDrive\문서\robocopy"
$errorLogFile = "$summaryLogDir\_backup_errors.txt"

if (-not (Test-Path $summaryLogDir)) { New-Item -ItemType Directory -Path $summaryLogDir -Force | Out-Null }
$null | Out-File -FilePath $errorLogFile -Encoding utf8

$backupJobs = @(
    @{ 
	Name = "chatter-public"; 
	Src = "d:\chatter\public";  
	Dests = @("f:\chatter\public", "h:\chatter\public"); 
	LogDir = "d:\OneDrive\문서\robocopy\chatter" 
	},
    @{ 
	Name = "chatter-src";    
	Src = "d:\chatter\src";     
	Dests = @("f:\chatter\src", "h:\chatter\src");    
	LogDir = "d:\OneDrive\문서\robocopy\chatter" 
	},
    @{ 
	Name = "music";          
	Src = "e:\music";           
	Dests = @("d:\music", "h:\music");                
	LogDir = "d:\OneDrive\문서\robocopy\music" 
	},
    @{ 
	Name = "programs";       
	Src = "d:\programs";        
	Dests = @("e:\programs", "h:\programs");          
	LogDir = "d:\OneDrive\문서\robocopy\programs" 
	},
    @{ 
	Name = "subtitles";      
	Src = "d:\subtitles";       
	Dests = @("e:\subtitles", "f:\subtitles", "g:\subtitles", "h:\subtitles"); 
	LogDir = "d:\OneDrive\문서\robocopy\subtitles" }
	,
    @{ 
	Name = "onedrive";       
	Src = "d:\OneDrive";        
	Dests = @("f:\OneDrive");                         
	LogDir = "d:\OneDrive\문서\robocopy\onedrive" 
	}
)

# ==========================================
# 2. 백업 프로세스 루프 실행
# ==========================================
foreach ($job in $backupJobs) {
    
    # 원본 실종 시 에러 처리
    if (-not (Test-Path $job.Src)) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $msg = "[$timestamp] [원본 실종] 백업을 건너뜀: $($job.Src)"
        Add-Content -Path $errorLogFile -Value $msg
        continue
    }

    if (-not (Test-Path $job.LogDir)) {
        New-Item -ItemType Directory -Path $job.LogDir -Force | Out-Null
    }

    $srcDrive = $job.Src.Substring(0, 1).ToLower()

    foreach ($dest in $job.Dests) {
        $destDrive = $dest.Substring(0, 1).ToLower()
        $logFile = "$($job.LogDir)\_$($job.Name)-$srcDrive$destDrive-$rdate.log"

        # Robocopy 실행
        robocopy $job.Src $dest $opt "/log:$logFile"

        # 백업 실패 시 에러 처리 (이번 실행 중에 발견된 에러들만 순서대로 누적)
        if ($LASTEXITCODE -ge 8) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            $msg = "[$timestamp] [백업 실패] 코드($LASTEXITCODE): $($job.Name) ($($job.Src) -> $dest)"
            Add-Content -Path $errorLogFile -Value $msg
        }
    }
}

# ==========================================
# 3. 30일이 지난 오래된 로그 파일 자동 삭제
# ==========================================
$uniqueLogDirs = $backupJobs.LogDir | Select-Object -Unique
foreach ($logDir in $uniqueLogDirs) {
    if (Test-Path $logDir) {
        Get-ChildItem -Path $logDir -Filter *.log | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
            Remove-Item -Force
    }
}
```

`/mir` : 원본 폴더와 동일하게 유지합니다. 원본 폴더의 파일이나 폴더를 삭제했을 경우, 똑같이 백업 폴더나 파일도 삭제합니다.   
`/r:2` : 오류 시 재시도 횟수입니다. (미지정 시 백만번 재시도)  
`/w:1` : 오류 시 재시도 대기시간(초)입니다. (미지정 시 횟수당 30초씩 대기)  
`$rdate` = Get-Date -Format "yyyy-MM-dd" : 2030-12-31 과 같은 날짜 형식을 사용합니다.  
`$summaryLogDir` : 오류 기록 요약 파일이 저장될 위치입니다.  
`$errorLogFile` : 오류 기록 요약 파일 이름입니다.  

`Src` : 원본 폴더입니다.  
`Dests` : 백업 위치입니다.  
`LogDir` : 로그 파일이 저장될 위치입니다.   

--- 

> [!tip|hide]
> 저는 항상 다른 드라이브로 백업하므로 원본과 백업 위치의 드라이브명에 따라 자동으로 조합해서 로그파일의 이름이 생성되도록 설정했습니다.  
> 생성되는 .log 파일 이름이 다르길 원하면 수정하면 됩니다.  

위 파일을 UTF-8 (BOM) 형식으로 저장하고 우클릭 'PowerShell에서 실행' 하면 파워쉘 창이 뜨고, 백업이 끝날때까지 로그 파일이 만들어지는 과정이 표시됩니다.  

백업이 끝나면 자동으로 닫히긴 하지만, 백업 시간이 길면 눈에 거슬립니다.  

파워쉘 창이 뜨지 않도록 처리할 수 있습니다.  
robocopy-backup.ps1 파일과 같은 폴더에 <mark>robocopy-backup.vbs</mark> 처럼 알기 쉬운 이름으로 빈파일을 하나 만들고, 아래 내용을 적절하게 수정하고 저장합니다.

```vb file="robocopy-backup.vbs"
Dim sh
Set sh = CreateObject("WScript.Shell")
Dim scriptPath
scriptPath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\robocopy-backup.ps1"

sh.Run "powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & scriptPath & """", 0, False
```

앞으로는 이 robocopy-backup.vbs 파일을 실행하면 파워쉘 창이 뜨지 않습니다.  

백업은 수동으로 한 번씩 실행해도 되겠지만, 윈도우 작업 스케줄러에 등록해서 정해진 시간에 자동으로 실행되도록 설정하면 좋습니다.

### 에러 발생 시  

백업 중 에러가 발생하면, 위에서 설정한 폴더와 파일명에 따라 _backup_errors.txt 같은 에러 요약 파일이 생성됩니다.  
에러 요약 파일이 생성되고 내용이 기록된다해도, 항상 백업이 실패하는 것은 아닙니다.  
대부분의 경우 무시해도 될만한 에러입니다.  

```txt file="_backup_errors.txt"
[2026-06-04 19:45:45] [백업 실패] 코드(8): programs (d:\programs -> e:\programs)
[2026-06-04 19:45:53] [백업 실패] 코드(8): programs (d:\programs -> h:\programs)
[2026-06-04 19:45:53] [백업 실패] 코드(16): subtitles (d:\subtitles -> g:\subtitles)
[2026-06-04 19:45:55] [백업 실패] 코드(9): onedrive (d:\OneDrive -> f:\OneDrive)

```

로그 파일이 저장되는 폴더로 이동해서 해당 로그 파일들을 열어봤습니다.  

```
2026/06/04 19:45:39 오류 32 (0x00000020) 파일을 복사하는 중 d:\programs\All\Network\chrlauncher\profile\Default\Network\Cookies
다른 프로세스가 파일을 사용 중이기 때문에 프로세스가 액세스 할 수 없습니다.

2026/06/04 19:45:53 오류 3 (0x00000003) 대상 디렉터리를 만드는 중 g:\subtitles\
지정된 경로를 찾을 수 없습니다.

2026/06/04 19:45:54 오류 32 (0x00000020) 파일을 복사하는 중 d:\OneDrive\.849C9593-D756-4E56-8D6E-42412F2A707B
다른 프로세스가 파일을 사용 중이기 때문에 프로세스가 액세스 할 수 없습니다.
```

사용중이라 윈도우에 의해 잠긴 파일들이 원인인 경우가 대부분이고, 무시해도 됩니다.  
백업 폴더가 존재하지 않으면 폴더를 만들지만, 드라이브 자체가 없을 경우 오류를 기록합니다.  

### Robocopy 종료(반환) 코드의 의미  

종료 코드와 오류 코드는 다릅니다.  
종료 코드 0~7은 성공을 의미하며 8 이상은 실패를 의미합니다.  
제 경우는 코드(8), 코드(9), 코드(16)이 기록되었지만, 확인해보면 무시해도 되거나, 왜 오류가 생기는지 알고 있는 상황입니다.  

| 코드  | <div align="center">설명</div> |
| :---: | ------------- |
| 0  | 오류가 발생하지 않았습니다.  <br> 파일이 복사되지 않았습니다. <br> 동기화된 상태입니다.  |  
| 1  | 모든 파일이 성공적으로 복사되었습니다.  |  
| 2  | 원본 디렉터리에 없는 일부 추가 파일이 대상 디렉터리에 있습니다.  <br> 파일이 복사되지 않았습니다. |
| 3 <br> (2+1) | 일부 파일이 복사되었습니다.  <br> 추가 파일이 있습니다. <br> 오류는 발생하지 않았습니다. |
| 4  | 일치하지 않는 파일 또는 디렉터리가 감지되었습니다.  <br> 출력 로그를 검토하십시오. 정리 작업이 필요할 수 있습니다. |
| 5 <br> (4+1) | 일부 파일이 복사되었습니다.  <br> 일부 파일이 일치하지 않습니다. <br> 오류가 발생하지 않았습니다. |
| 6 <br> (4+2) | 추가 파일 및 일치하지 않는 파일이 있습니다.  <br> 파일이 복사되지 않았고 실패가 발생하지 않았습니다. <br> 즉, 파일이 대상 디렉터리에 이미 존재합니다. |
| 7 <br> (4+2+1) | 파일이 복사되었는데, 파일 불일치가 발생했고, 추가 파일이 존재했습니다.  |  
| 8  | 일부 파일이 복사되지 않았습니다.  | 
| 9 <br> (8+1) | 모든 파일이 성공적으로 복사되었지만, 일부 파일은 실패했습니다.  |  
| 16  | 심각한 오류입니다. <br> 파일이 복사되지 않았습니다. <br> 엑세스 권한이 없거나 드라이브가 존재하지 않습니다. | 
