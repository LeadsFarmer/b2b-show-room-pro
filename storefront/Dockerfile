# Multi-stage build for Next.js storefront
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

# Set build-time env vars
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://placeholder-backend:9000
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_placeholder
ENV NEXT_PUBLIC_BASE_URL=http://placeholder:3000
ENV NEXT_PUBLIC_DEFAULT_REGION=fr
ENV SKIP_ENV_VALIDATION=true

# Build Next.js with standalone output
RUN corepack enable && yarn build

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port
EXPOSE 8000

ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Start server
CMD ["node", "server.js"]
