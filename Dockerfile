FROM node:20.11.1-alpine

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]
