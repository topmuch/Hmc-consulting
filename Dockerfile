FROM node:20-alpine

RUN apk add --no-cache git libc6-compat sqlite
RUN npm install -g bun

WORKDIR /app

RUN git clone https://github.com/topmuch/Hmc-consulting .

RUN bun install

RUN npx prisma generate

# Create the database before build so Prisma queries during SSG don't crash
RUN mkdir -p /app/data && \
    DATABASE_URL=file:/app/data/hmc.db npx prisma db push --skip-generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/data/hmc.db

RUN bun run build

RUN mkdir -p /app/data

EXPOSE 3000

CMD sh -c "\
  mkdir -p /app/data && \
  export DATABASE_URL=file:/app/data/hmc.db && \
  export PORT=3000 && \
  export HOSTNAME=0.0.0.0 && \
  echo '[startup] Running prisma db push...' && \
  npx prisma db push --skip-generate 2>&1 || { echo '[startup] WARNING: prisma db push failed, continuing...'; } && \
  echo '[startup] Starting server (admin users seeded via instrumentation)...' && \
  node .next/standalone/server.js"
