@echo off
chcp 65001 > nul
title Golden Machine - FunPay Automation Suite
color 06

echo ===================================================
echo           👑 GOLDEN MACHINE LAUNCHER 👑
echo ===================================================
echo.

if not exist "node_modules\" (
    echo [*] Первый запуск: установка необходимых компонентов...
    call npm.cmd install
    if errorlevel 1 (
        echo [-] Ошибка установки модулей. Проверьте установку Node.js.
        pause
        exit /b 1
    )
)

echo [*] Запуск Golden Machine и открытие браузера...
node src/launcher/launcher.js

pause
