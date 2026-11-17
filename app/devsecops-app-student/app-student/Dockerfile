FROM node:22-alpine

# Atualiza pacotes do sistema operacional para corrigir CVEs críticas
RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

# Mantém a execução com utilizador não-root exigida pelo Semgrep
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]