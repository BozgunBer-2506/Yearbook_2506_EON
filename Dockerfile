# Client build only - served as static files
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY yearbook-v2/package.json yearbook-v2/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY yearbook-v2/ .
RUN pnpm build
EXPOSE 3000
CMD ["npx", "serve", "dist/public", "-l", "3000"]
