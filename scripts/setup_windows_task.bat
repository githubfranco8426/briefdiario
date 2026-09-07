@echo off
REM Registra una tarea programada nativa en Windows para ejecutar el brief diario a las 06:30 AM
echo ======================================================
echo Registrando Tarea Programada: Brief Diario rehabilita.me
echo Horario: Todos los dias a las 06:30 AM
echo ======================================================

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%.."

schtasks /create /tn "BriefDiarioRehabilitaMe" /tr "node \"%SCRIPT_DIR%generateBrief.js\"" /sc daily /st 06:30 /f

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Tarea programada registrada exitosamente en Windows.
    echo Puedes verla o modificarla en el 'Programador de tareas' de Windows.
) else (
    echo.
    echo [ERROR] No se pudo registrar la tarea. Asegurate de ejecutar esta consola como Administrador.
)
pause
