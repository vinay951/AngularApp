# Stage 0: compile angular frontend
FROM node:18 AS build
RUN npm install
RUN ng build
USER root
WORKDIR /app

COPY . .

# RUN npm ci --no-audit
# RUN npm run build-qagcp
RUN echo "after npm run build"
RUN cp ./nginx.conf ./dist
RUN ls -l ./dist
RUN echo "after npm run build"
ENV PORT 8080
ENV HOST 0.0.0.0
RUN echo "after nginx.conf copy cmd"

# Stage 1: serve app with nginx server
FROM nginx:alpine
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

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
