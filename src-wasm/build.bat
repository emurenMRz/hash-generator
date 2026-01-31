@echo off
setlocal enabledelayedexpansion

for /f "delims=" %%i in ('git rev-parse --show-toplevel') do set "REPOROOT=%%i"

set "MODULES=hash"

for %%M in (%MODULES%) do (
    echo Building %%M.wasm...
    set "GOOS=js"
    set "GOARCH=wasm"
    go build -o "%REPOROOT%\out\hash\%%M.wasm" -trimpath .
)

if not exist "%REPOROOT%\out\hash\wasm_exec.js" (
    echo Copying wasm_exec.js from Go installation...
    for /f "delims=" %%g in ('go env GOROOT') do set "GOROOT=%%g"
    copy "!GOROOT!\lib\wasm\wasm_exec.js" "%REPOROOT%\out\hash\"
)

echo Done. All WASM modules built successfully.
exit /b 0
