FROM node:22

WORKDIR /app

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3005

CMD ["npm", "run", "dev"]