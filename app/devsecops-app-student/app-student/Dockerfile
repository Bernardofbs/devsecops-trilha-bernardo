FROM node:14

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY . .

RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]