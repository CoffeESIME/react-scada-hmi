# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:20-alpine AS deps

# Install libc compatibility for native modules (canvas, bufferutil, etc.)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package manifests first for optimal layer caching
COPY package.json package-lock.json ./

# Install production + dev dependencies (needed for build)
RUN npm ci --frozen-lockfile

# ============================================================
# Stage 2: Build the Next.js application
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Bring in installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the full source
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build arguments — must be provided via --build-arg or docker-compose build.args
# Defaults are intentionally empty placeholders so builds never silently use
# production credentials. Pass real values through .env → docker-compose.yml.
ARG NEXT_PUBLIC_API_URL=http://localhost:8888
ARG NEXT_PUBLIC_MQTT_WS_URL=ws://localhost:9001
ARG NEXT_PUBLIC_MQTT_USERNAME=changeme
ARG NEXT_PUBLIC_MQTT_PASSWORD=changeme

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MQTT_WS_URL=$NEXT_PUBLIC_MQTT_WS_URL
ENV NEXT_PUBLIC_MQTT_USERNAME=$NEXT_PUBLIC_MQTT_USERNAME
ENV NEXT_PUBLIC_MQTT_PASSWORD=$NEXT_PUBLIC_MQTT_PASSWORD

RUN npm run build

# ============================================================
# Stage 3: Production runner — minimal image
# ============================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone entrypoint
CMD ["node", "server.js"]
