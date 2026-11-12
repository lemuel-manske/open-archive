# syntax=docker/dockerfile:1.4

FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/package*.json frontend/.npmrc ./

RUN --mount=type=secret,id=npm_token,target=/run/secrets/npm_token \
    GH_TOKEN="$(cat /run/secrets/npm_token)" npm ci

COPY frontend/ ./

RUN npm run build


FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
