FROM node:16.13.0-alpine

WORKDIR /app
COPY . /app

RUN npm ci --only=prod
CMD [ "node", "src/server.js" ]
