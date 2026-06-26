# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build: compile the Vite/React application
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package*.json ./
RUN npm install --no-audit --no-fund

# Copy all source files
COPY . .

# VITE_API_URL="" → BASE_URL resolves to "" → all API calls become relative
# ("/api/products"). Nginx then reverse-proxies them to the backend service.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve: production Nginx serving static files + reverse proxy
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Inject our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled React app from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build: compile the Vite/React application
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first for better layer caching
COPY package*.json ./
RUN npm ci --silent

# Copy all source files
COPY . .

# VITE_API_URL="" → BASE_URL resolves to "" → all API calls become relative
# ("/api/products"). Nginx then reverse-proxies them to the backend service.
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve: production Nginx serving static files + reverse proxy
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:alpine AS production

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Inject our custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled React app from stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
