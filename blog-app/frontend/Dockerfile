FROM node:16 AS testing-stage

WORKDIR /usr/src/test

COPY ./package.json .

RUN yarn install

COPY . .

RUN CI=true yarn test

FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY ./package.json .

RUN yarn install

COPY --from=testing-stage /usr/src/test/ /usr/src/app

RUN yarn build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

