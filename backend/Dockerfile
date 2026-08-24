# Image dùng cho môi trường dev (docker-compose.yml)
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
