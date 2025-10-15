# Multi-stage build for Medusa backend
FROM node:22-alpine AS base
WORKDIR /app

# Enable Corepack for Yarn 4
RUN corepack enable

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --frozen-lockfile

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock .yarnrc.yml ./
COPY . .

# Build both backend and admin
RUN corepack enable && yarn build

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Copy built files and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/src ./src
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.yarnrc.yml ./

# Expose port
EXPOSE 9000

# Start server - Use the compiled server
CMD ["node", ".medusa/server/index.js"]
