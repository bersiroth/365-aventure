# syntax=docker/dockerfile:1

# ===========================
# STAGE 1: Build du frontend (Vite)
# ===========================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js postcss.config.js tailwind.config.js ./
COPY src/ ./src/
COPY public/ ./public/

RUN npm run build

# ===========================
# STAGE 2: Dépendances serveur (production)
# ===========================
FROM node:20-alpine AS server-deps

WORKDIR /app/server

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ===========================
# STAGE 3: Image finale
# ===========================
FROM node:20-alpine

# NODE_ENV=production désactive les routes /api/dev, dont /api/dev/reset qui vide la base
ENV NODE_ENV=production \
    PORT=3636 \
    DB_PATH=/app/data/donjon.db

WORKDIR /app

COPY --from=server-deps --chown=node:node /app/server/node_modules ./server/node_modules
COPY --chown=node:node server/ ./server/
# gameLogic.js et routes/save.js importent depuis src/data/
COPY --chown=node:node src/data/ ./src/data/
COPY --from=frontend --chown=node:node /app/dist ./dist

# Dossier de la base, monté en volume ; le mode WAL y écrit aussi donjon.db-wal et -shm
RUN mkdir -p /app/data && chown node:node /app/data

USER node

EXPOSE 3636

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3636/ || exit 1

CMD ["node", "server/index.js"]
