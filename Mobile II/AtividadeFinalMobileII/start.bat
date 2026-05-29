@echo off
echo ====================================
echo  Iniciando MongoDB Server + Expo
echo ====================================
echo.

REM Verifica se o MongoDB está rodando
echo [1/3] Verificando MongoDB...
timeout /t 1 >nul

REM Inicia o servidor MongoDB em nova janela
echo [2/3] Iniciando servidor MongoDB (localhost:3000)...
start "MongoDB Server" cmd /k "cd Server && npm start"
timeout /t 3 >nul

REM Inicia o Expo
echo [3/3] Iniciando Expo...
echo.
echo ✅ Servidor MongoDB: http://localhost:3000
echo ✅ App Expo: aguarde inicialização...
echo.
cd Front
npx expo start

pause
