FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start the Vite dev server
CMD ["npm", "run", "dev"]
