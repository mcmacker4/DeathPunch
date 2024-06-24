FROM node:lts-alpine AS build

WORKDIR /build

COPY package.json ./
COPY dist ./dist

RUN apk add build-base libtool autoconf automake python3
RUN npm install --verbose


FROM node:lts-alpine

WORKDIR /bot

COPY --from=build /build/dist ./dist
COPY --from=build /build/node_modules ./node_modules

RUN apk add ffmpeg

CMD ["node", "dist/main.js", "/config.json"]
