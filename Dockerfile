# syntax=docker/dockerfile:1

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Build-time env vars (required during SvelteKit build analysis phase)
ARG DATABASE_URL=postgres://dummy:dummy@localhost:5432/dummy
ARG STRIPE_SECRET_KEY=sk_test_dummy
ARG STRIPE_WEBHOOK_SECRET=whsec_dummy
ARG STRIPE_STARTER_MONTHLY_PRICE_ID=price_dummy
ARG STRIPE_STARTER_YEARLY_PRICE_ID=price_dummy
ARG STRIPE_GROWTH_MONTHLY_PRICE_ID=price_dummy
ARG STRIPE_GROWTH_YEARLY_PRICE_ID=price_dummy
ARG BETTER_AUTH_SECRET=dummy-secret
ARG BETTER_AUTH_URL=http://localhost
ARG ORIGIN=http://localhost
ARG PUBLIC_POSTHOG_KEY=dummy-key
ARG PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
ENV DATABASE_URL=${DATABASE_URL}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV STRIPE_STARTER_MONTHLY_PRICE_ID=${STRIPE_STARTER_MONTHLY_PRICE_ID}
ENV STRIPE_STARTER_YEARLY_PRICE_ID=${STRIPE_STARTER_YEARLY_PRICE_ID}
ENV STRIPE_GROWTH_MONTHLY_PRICE_ID=${STRIPE_GROWTH_MONTHLY_PRICE_ID}
ENV STRIPE_GROWTH_YEARLY_PRICE_ID=${STRIPE_GROWTH_YEARLY_PRICE_ID}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV ORIGIN=${ORIGIN}
ENV PUBLIC_POSTHOG_KEY=${PUBLIC_POSTHOG_KEY}
ENV PUBLIC_POSTHOG_HOST=${PUBLIC_POSTHOG_HOST}

# Install dependencies first (better layer caching)
COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# The migration service uses this same immutable image before the app starts.
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S sveltekit -u 1001
USER sveltekit

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "build"]
