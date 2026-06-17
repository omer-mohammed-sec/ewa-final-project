FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source files
COPY server.js ./
COPY prisma.config.ts ./

EXPOSE 5000

CMD ["node", "server.js"]
