FROM node:10 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG APP_MOUNT_URI
ARG API_URI
ARG STATIC_URL
ARG PILGRIMAGE_API_URI
ENV API_URI ${API_URI:-http://localhost:8000/graphql/}
ENV APP_MOUNT_URI ${APP_MOUNT_URI:-/dashboard/}
ENV STATIC_URL ${STATIC_URL:-/dashboard/}
ENV PILGRIMAGE_API_URI ${PILGRIMAGE_API_URI:-http://localhost:8000/}
RUN STATIC_URL=${STATIC_URL} API_URI=${API_URI} APP_MOUNT_URI=${APP_MOUNT_URI} PILGRIMAGE_API_URI=${PILGRIMAGE_API_URI} npm run build

FROM nginx:stable
WORKDIR /app
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build/ /app/
