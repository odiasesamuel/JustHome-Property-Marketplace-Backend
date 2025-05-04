# Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port (adjust this to your app.listen port)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
