# Stage 1: Build
FROM node:22-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências (apenas produção no final, mas todas para build)
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Build da aplicação
RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS production

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile && \
    pnpm store prune

# Copiar arquivos compilados do stage de build
COPY --from=builder /app/dist ./dist

# Garantir que usamos o package.json correto do root (não o do dist que tem script antigo)
COPY --from=builder /app/package.json ./package.json

# Mudar ownership para usuário não-root
RUN chown -R nestjs:nodejs /app


# Mudar para usuário não-root
USER nestjs

# Expor porta
EXPOSE 8000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8000

# Comando para iniciar a aplicação
CMD ["pnpm", "start:prod"]