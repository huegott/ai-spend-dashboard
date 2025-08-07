FROM node:18-alpine

# Install git and build dependencies
RUN apk add --no-cache git python3 make g++

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Copy and set up secure entrypoint
COPY docker-entrypoint.sh /app/
COPY secure-secrets.js /app/
RUN chmod +x /app/docker-entrypoint.sh

# Install and build client
RUN cd client && npm ci && npm run build

# Clean up build dependencies
RUN apk del python3 make g++ && \
    rm -rf /root/.npm /tmp/* /var/cache/apk/*

# Initialize database schema on container start
RUN mkdir -p server/migrations

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Create ssl directory for certificates
RUN mkdir -p /app/ssl && chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Use secure entrypoint to load secrets before starting app
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]