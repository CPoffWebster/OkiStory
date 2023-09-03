# Use a Node.js base image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Build the project
RUN npm run build

# Run the app
CMD ["npm", "start"]
