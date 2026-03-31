FROM node:22-alpine AS build
LABEL org.opencontainers.image.source=https://github.com/kristjanjansen/mfe-frontends

ARG SERVICE_NAME
ENV APP=${SERVICE_NAME}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.27-alpine

ARG SERVICE_NAME
COPY --from=build /app/dist/${SERVICE_NAME}/ /usr/share/nginx/html/

RUN echo 'server { listen 4000; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; add_header Access-Control-Allow-Origin *; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 4000
