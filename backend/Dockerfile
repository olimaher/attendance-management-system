# Usar Debian (más compatible, usado en producción)
FROM node:20

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando de inicio
CMD ["npm", "run", "dev"]
