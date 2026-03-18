FROM node:20-slim

WORKDIR /app

# Copy package files from server directory
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server source
COPY server/ .

EXPOSE 5000

CMD ["node", "src/index.js"]
