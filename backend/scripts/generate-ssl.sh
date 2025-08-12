#!/bin/bash

# Script per generare certificati SSL auto-firmati per sviluppo
# NON usare questi certificati in produzione!

echo "🔐 Generazione certificati SSL per sviluppo..."

# Crea la directory ssl se non esiste
mkdir -p ssl

# Genera certificato auto-firmato
openssl req -x509 -newkey rsa:4096 -keyout ssl/private-key.pem -out ssl/certificate.pem -days 365 -nodes -subj "/C=IT/ST=Italy/L=City/O=TodoApp/OU=Development/CN=localhost"

echo "✅ Certificati SSL generati in ./ssl/"
echo "⚠️  ATTENZIONE: Questi sono certificati auto-firmati per sviluppo"
echo "   Il browser mostrerà un avviso di sicurezza che puoi ignorare"
echo ""
echo "🚀 Ora puoi avviare il server con: npm run dev"
echo "   HTTP:  http://localhost:5000"
echo "   HTTPS: https://localhost:5443"