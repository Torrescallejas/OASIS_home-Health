FROM node:18

WORKDIR /app

# 1) Copiamos solo package.json* para cachear npm ci
COPY package*.json tsconfig.json prisma ./ 
RUN npm ci        # usa package-lock si lo tienes

# 2) Copiamos el resto del código
COPY . .

# 3) Generamos Prisma client
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
