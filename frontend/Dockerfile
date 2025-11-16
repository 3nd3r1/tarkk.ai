# Dockerfile for Tarkist.us Frontend (Next.js 14)
# Multi-stage build for optimized production deployment

# ============================================================================
# Dependencies Stage
# ============================================================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# ============================================================================
# Builder Stage
# ============================================================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# ============================================================================
# Production Stage
# ============================================================================
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variable for port
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

# Create a simple health check script
RUN echo 'const http = require("http"); \
const options = { hostname: "localhost", port: 3000, path: "/api/health", timeout: 2000 }; \
const req = http.request(options, (res) => process.exit(res.statusCode === 200 ? 0 : 1)); \
req.on("error", () => process.exit(1)); \
req.end();' > healthcheck.js

# Start the application
CMD ["node", "server.js"]