FROM node:22.8.0-alpine3.20

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8822

ENTRYPOINT ["npm", "start"]