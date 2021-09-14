# BUILD IMAGE
FROM node:lts-buster as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV "production"

RUN npm run build

# PRODUCTION TARGET IMAGE
FROM node:lts-alpine as production

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV "production"

RUN npm ci --only=production install

COPY --from=build /app/dist ./dist

CMD ["node", "dist/main"]