# # Use a Node.js base image
# FROM node:18

# # Set the working directory
# WORKDIR /app

# # Copy package.json and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the entire project
# COPY . .

# # Build the project
# RUN npm run build

# # Run the app
# CMD ["npm", "start"]


# ---- Base Node ----
FROM node:18 AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# ---- Build ----
FROM base AS build
COPY . .
RUN npm run build

# ---- Production with Nginx ----
FROM nginx:alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
