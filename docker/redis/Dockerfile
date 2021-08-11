# syntax=docker/dockerfile:1
FROM redis:alpine
RUN apk add --update --no-cache tzdata
ENV TZ=America/New_York
USER redis
