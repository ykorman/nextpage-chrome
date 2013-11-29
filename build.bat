@echo off
setlocal enableDelayedExpansion 

rmdir /S /Q release 
mkdir release

for /F %%f in (build_filelist.txt) do (
  copy /Y %%f release
)

CScript zip.vbs %~dp0release %~dp0release.zip

pause