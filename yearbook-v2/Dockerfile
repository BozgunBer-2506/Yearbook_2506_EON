FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g serve
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["serve", "-s", "dist/public", "-l", "3000"]
# cache bust Sun Mar 22 15:25:08 CET 2026
