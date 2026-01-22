@echo off
setlocal enabledelayedexpansion

echo.
echo ======================================
echo   Sistema de Gestion de Asistencia
echo ======================================
echo.
echo Iniciando sistema en WSL...
echo.

REM Ejecutar el script de bash en WSL
wsl bash -c "cd ~/proyectos/attendance-management-system && ./start.sh"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Presiona cualquier tecla para cerrar...
    pause >nul
) else (
    echo.
    echo Error al iniciar el sistema.
    echo Presiona cualquier tecla para cerrar...
    pause >nul
    exit /b 1
)
