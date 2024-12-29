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
RUN ng build --configuration production

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist/angular-app /usr/share/nginx/html

# Expose the port that the app will be available on
EXPOSE 80

# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]

