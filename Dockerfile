FROM node:15.13.0-alpine3.10

WORKDIR /lhub-api

COPY package*.json ./

RUN npm install

RUN chmod 777 node_modules

COPY . .

CMD ["npm", "run", "start:dev"]