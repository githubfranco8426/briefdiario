@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================================
echo   Subiendo Brief Diario a GitHub (origin/main)
echo ============================================================
echo.

git push origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo   [EXITO] Cambios subidos correctamente a GitHub.
    echo   El flujo automatico de las 06:30 AM ya esta activo.
    echo ============================================================
) else (
    echo.
    echo ============================================================
    echo   [ATENCION] Si es la primera vez que subes desde este equipo,
    echo   inicia sesion en la ventana que se abrio en tu navegador.
    echo ============================================================
)

echo.
pause
