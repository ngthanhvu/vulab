FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3005

CMD ["npm", "run", "dev"]