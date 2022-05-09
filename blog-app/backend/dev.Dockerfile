FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN yarn install

ENV DEBUG=backend:*

USER node

CMD yarn dev
