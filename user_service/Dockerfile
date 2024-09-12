FROM node:alpine

WORKDIR /user/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .
