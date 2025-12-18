FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV NODE_ENV=development

CMD ["npm", "run", "dev", "--", "--host"]
