# Step 1: Build the Angular app
FROM node:18 AS build

WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the Angular source code
COPY . .

# Build the Angular app for production
RUN ng build

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the custom Nginx config into the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/angular-app/browser /usr/share/nginx/html

# Expose port 8080 (required by Google Cloud Run)
EXPOSE 8080

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
