# Stage 1: Build the Angular app
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all the source files into the container
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the built Angular app from the build stage to Nginx's default folder
COPY --from=build /app/dist/angular-app /usr/share/nginx/html

# Copy the custom Nginx config to make it listen on port 8080
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080 (the port Cloud Run expects)
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
