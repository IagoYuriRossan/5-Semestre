#!/bin/bash

echo "===================================="
echo " Iniciando MongoDB Server + Expo"
echo "===================================="
echo ""

# Inicia o servidor MongoDB em background
echo "[1/2] Iniciando servidor MongoDB (localhost:3000)..."
cd Server
npm start &
MONGODB_PID=$!
echo "✅ Servidor MongoDB iniciado (PID: $MONGODB_PID)"

# Aguarda 3 segundos
sleep 3

# Volta para pasta raiz e inicia Expo
cd ../Front
echo "[2/2] Iniciando Expo..."
echo ""
echo "✅ Servidor MongoDB: http://localhost:3000"
echo "✅ App Expo: aguarde inicialização..."
echo ""

npx expo start

# Cleanup ao sair
trap "kill $MONGODB_PID 2>/dev/null" EXIT
