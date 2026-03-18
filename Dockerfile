# Client build - Yearbook V2
FROM node:20-alpine
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files from yearbook-v2
COPY yearbook-v2/package.json yearbook-v2/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy yearbook-v2 source
COPY yearbook-v2/ .

# Build the project
RUN pnpm build

# Expose port
EXPOSE 3000

# Serve the built files
CMD ["npx", "serve", "dist/public", "-l", "3000"]
