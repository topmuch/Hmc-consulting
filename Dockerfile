FROM node:20-alpine

RUN apk add --no-cache git libc6-compat sqlite
RUN npm install -g bun

WORKDIR /app

RUN git clone https://github.com/topmuch/Hmc-consulting .

RUN bun install

RUN npx prisma generate

RUN DATABASE_URL=file:/app/data/hmc.db NEXT_TELEMETRY_DISABLED=1 bun run build

RUN mkdir -p /app/data

EXPOSE 3000

CMD sh -c "mkdir -p /app/data && export DATABASE_URL=file:/app/data/hmc.db && export PORT=3000 && export HOSTNAME=0.0.0.0 && npx prisma db push --skip-generate 2>/dev/null || true && node .next/standalone/server.js"
