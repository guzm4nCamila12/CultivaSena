# Etapa 1: Build de la aplicación
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent && npm cache clean --force

COPY . .

# Variables para el build
ARG REACT_APP_API_URL
ARG REACT_APP_API_URL_CULTIVA

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_API_URL_CULTIVA=$REACT_APP_API_URL_CULTIVA
ENV NODE_ENV=production

RUN npm run build

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

RUN echo 'server {\
    listen 80;\
    server_name localhost;\
    root /usr/share/nginx/html;\
    index index.html;\
    \
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;\
    \
    location / {\
        try_files $uri /index.html;\
    }\
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]