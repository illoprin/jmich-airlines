# run in dev mode
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]