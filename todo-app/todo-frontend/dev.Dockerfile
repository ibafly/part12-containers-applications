FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENV REACT_APP_BACKEND_URL=//localhost:3004

CMD yarn start
