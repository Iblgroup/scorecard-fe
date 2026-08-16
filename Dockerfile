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

# Accept build argument for API URL
ARG VITE_API_BASE_URL=http://localhost:3005/api

# Set as environment variable for Vite build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Where an unauthenticated visitor is sent. Baked in at build time like the
# API URL above, so changing it needs a rebuild.
ARG VITE_AUTH_PORTAL_URL=http://208.110.83.26:4001
ENV VITE_AUTH_PORTAL_URL=${VITE_AUTH_PORTAL_URL}

# Authenticator API, for redeeming the one-time handoff ticket.
ARG VITE_AUTH_API_URL=http://208.110.83.26:4002/api
ENV VITE_AUTH_API_URL=${VITE_AUTH_API_URL}

# Build the application
RUN npm run build

# Production serve stage with nginx
FROM nginx:alpine AS production

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3004
EXPOSE 3004

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
