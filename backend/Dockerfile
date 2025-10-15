# Multi-stage build for Medusa backend
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build both backend and admin
RUN yarn build

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Copy built files and dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa
COPY --from=builder /app/medusa-config.ts ./
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 9000

# Start server
CMD ["yarn", "medusa", "start"]
