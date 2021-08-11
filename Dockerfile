# syntax=docker/dockerfile:1
FROM node:16-alpine AS base
RUN apk add --update --no-cache git tzdata
ENV TZ=America/New_York
ENV TINI_VERSION v0.19.0
ENV WAITFOR_VERSION v2.1.2
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /usr/local/bin/tini
ADD https://github.com/Eficode/wait-for/releases/download/${WAITFOR_VERSION}/wait-for /usr/local/bin/wait-for
RUN chmod a+rx /usr/local/bin/tini /usr/local/bin/wait-for
ENTRYPOINT ["tini", "--"]

FROM node:16-alpine AS builder
ARG project
WORKDIR /repo
COPY . .
RUN node common/scripts/install-run-rush.js install --to @co/${project} && \
    node common/scripts/install-run-rush.js deploy -p @co/${project}

FROM base AS service
ARG project
COPY --chown=node:node --from=builder /repo/common/deploy/ /app
USER node
WORKDIR /app/services/${project}
CMD ["node", "src/index.js"]
