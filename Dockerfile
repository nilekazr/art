FROM node:current-slim

RUN mkdir -p /art/app

RUN mkdir ~/jenkins

WORKDIR /art/app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start"]
