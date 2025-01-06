# Use a specific Node.js version
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy only package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
