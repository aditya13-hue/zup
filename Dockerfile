# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files from root to here (we need dependencies)
# However, the backend is in /server but its dependencies might be in root?
# Let's check package.json in root.
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY server ./server

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "server/index.js"]
