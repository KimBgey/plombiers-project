FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Supprimer tout cache Prisma et réinstaller proprement
RUN npm install && npm install prisma@6 @prisma/client@6

COPY . .

# Générer le client Prisma standard
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/main.js