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
RUN echo "after npm run build"
RUN cp ./nginx.conf ./dist
RUN ls -l ./dist
RUN echo "after npm run build"
ENV PORT 8080
ENV HOST 0.0.0.0
RUN echo "after nginx.conf copy cmd"

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the built Angular app from the previous stage
RUN echo "after nginx build"
COPY --from=build /app/dist  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
USER root

RUN chown -R root:root /usr/share/nginx/html/index.html
RUN chmod -R 755 /usr/share/nginx/html
RUN ls -al /usr
RUN chmod o+x /usr
RUN chmod o+x /usr/share
RUN chmod o+x /usr/share/nginx
RUN chmod o+x /usr/share/nginx/html

RUN ls -l /usr/share/nginx/html

# Expose port 8080 (required by Google Cloud Run)
EXPOSE 8080


# Start Nginx to serve the app
CMD ["nginx", "-g", "daemon off;"]
