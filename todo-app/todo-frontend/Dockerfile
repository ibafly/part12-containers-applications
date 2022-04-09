FROM node:16 AS testing-stage

WORKDIR /usr/src/test

COPY . .

RUN yarn install

RUN CI=true yarn test

FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY --from=testing-stage /usr/src/test/ /usr/src/app

ENV REACT_APP_BACKEND_URL=http://localhost:3004

RUN yarn install

RUN yarn build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
