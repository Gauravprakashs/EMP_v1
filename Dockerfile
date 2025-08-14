# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Backend and Serve Frontend
FROM node:20-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend into backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Copy root-level files if needed
COPY package*.json ./

# Expose backend port
EXPOSE 5000

# Set environment variables (use Jenkins credentials injection)
ENV NODE_ENV=production

# Start backend
CMD ["npm", "run", "dev", "--prefix", "backend"]
