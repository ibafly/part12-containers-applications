FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node ./package.json .

RUN yarn install

ENV DEBUG=backend:*

USER node

COPY --chown=node:node . .

CMD yarn start
