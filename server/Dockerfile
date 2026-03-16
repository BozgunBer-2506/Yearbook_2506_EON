FROM node:20-slim
WORKDIR /app

RUN npm install -g nodemon

COPY server/package*.json ./
RUN npm install

COPY server/ .

EXPOSE 5000
CMD ["npm", "run", "dev"]
