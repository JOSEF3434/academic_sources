FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --quiet || npm install --quiet

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]



