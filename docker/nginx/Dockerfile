# syntax=docker/dockerfile:1
FROM nginx:alpine
RUN apk add --update --no-cache certbot tzdata && \
    mkdir /etc/letsencrypt
ENV TZ=America/New_York
COPY default.conf /etc/nginx/conf.d/default.conf
