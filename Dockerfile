# ===========================
# STAGE 1: Build React App
# ===========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances frontend
COPY package.json package-lock.json* ./

# Installer les dépendances frontend
RUN npm ci --ignore-scripts

# Copier le code source frontend
COPY . .

# Build de production
RUN npm run build

# ===========================
# STAGE 2: Node.js Production
# ===========================
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances serveur
COPY server/package.json server/package-lock.json* ./server/

# Installer les dépendances serveur (production only)
RUN cd server && npm ci --omit=dev

# Copier le code serveur
COPY server/ ./server/

# Copier les fichiers data partagés (monthConfigs)
COPY src/data/ ./src/data/

# Copier le build frontend depuis le stage précédent
COPY --from=builder /app/dist ./dist

EXPOSE 3636

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3636/ || exit 1

CMD ["node", "server/index.js"]
