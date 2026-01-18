# Build stage
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Start Vite in dev mode (for demo/production-ready setup we would use Nginx build stage)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
