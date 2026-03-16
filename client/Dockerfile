FROM node:20-slim
WORKDIR /app

RUN npm install -g serve

COPY client/package*.json ./
RUN npm install

COPY client/ .

RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]