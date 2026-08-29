# Development Stage
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3004

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3004"]

# Production Stage
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Origins only — clients append /api. Trailing slash on portal avoids an nginx 301.
ARG VITE_API_BASE_URL=https://dev-scorecard.onethunder.iblgrp.com
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

ARG VITE_AUTH_PORTAL_URL=https://dev.onethunder.iblgrp.com/login/
ENV VITE_AUTH_PORTAL_URL=${VITE_AUTH_PORTAL_URL}

ARG VITE_AUTH_API_URL=https://dev-login.onethunder.iblgrp.com
ENV VITE_AUTH_API_URL=${VITE_AUTH_API_URL}

# Build the application
RUN npm run build

# Production serve stage with nginx
FROM nginx:alpine AS production

# Filesystem matches URL sub-path (host nginx forwards /scorecard-dashboard/ unchanged)
COPY --from=build /app/dist /usr/share/nginx/html/scorecard-dashboard

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3004
EXPOSE 3004

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
