FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install

ENV DEBUG=frontend:*

CMD yarn start

