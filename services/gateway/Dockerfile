FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl openssl-dev

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000