FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm serve
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["serve", "dist/public", "-l", "3000"]
