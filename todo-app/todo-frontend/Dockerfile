FROM node:16 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENV REACT_APP_BACKEND_URL=http://localhost:3004

RUN yarn build

FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
