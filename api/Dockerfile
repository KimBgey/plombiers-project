FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Générer Prisma sans valider les variables d'env
RUN PRISMA_HIDE_UPDATE_MESSAGE=1 npx prisma generate --no-engine || npx prisma generate

RUN npm run build

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/main.js