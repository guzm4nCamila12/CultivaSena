# Etapa 1: Build de la aplicación
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para build)
RUN npm ci --silent && npm cache clean --force

# Copiar el resto de la aplicación
COPY . .

# Variables de entorno para el build
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV NODE_ENV=production

# Hacer build de producción (CRA genera /build)
RUN npm run build

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración de nginx para SPA (React Router)
RUN echo 'server {\
    listen 80;\
    server_name localhost;\
    root /usr/share/nginx/html;\
    index index.html;\
    \
    # Habilitar gzip\
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;\
    \
    # Configuración para SPA (React Router)\
    location / {\
        try_files $uri /index.html;\
    }\
    \
    # Cache estático\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
