FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep node || exit 1

CMD ["node", "index.js"]
