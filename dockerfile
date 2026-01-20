FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install all deps (karena build butuh devDeps)
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Create upload directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 3000

# Run compiled app
CMD ["node", "dist/server.js"]
