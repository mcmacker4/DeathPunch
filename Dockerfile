FROM node:22-alpine AS build

WORKDIR /build

COPY package.json tsconfig.json ./
COPY src ./src

RUN apk add build-base libtool autoconf automake python3
RUN npm install --verbose

RUN npm run build

FROM node:22-alpine

WORKDIR /bot

COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

RUN apk add ffmpeg

CMD ["node", "dist/main.js", "/config.json"]
