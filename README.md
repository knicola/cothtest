# COTHTEST

Fancy description of the project.

## Packages

| Project       | Name              | Path                      |
| ------------- | ----------------- | ------------------------- |
| API Server    | @co/api-server    | ./services/api-server     |
| App Config    | @co/app-config    | ./libraries/app-config    |
| Eslint Config | @co/eslint-config | ./libraries/eslint-config |

## Development

Install global packages:
```sh
$ npm i -g pnpm @microsoft/rush@5.50.0
```

Customize setup:
> Copy `.env.example` config file to `.env` and configure, if necessary. Services may also include a `.env.example` config file.
```sh
$ cp .env.example .env
```

Install project modules:
```sh
$ rush install
```

Run dev environment:
```sh
$ docker-compose up
```

Run tests for all projects:
```sh
$ rush test
```

Run tests for a single project:
> Run `docker-compose up` or `docker-compose up postgres-test` first for integration tests to work.
```sh
$ cd services/api-server
#
# all test suites
$ rushx test
#
# unit tests
$ rushx test:unit
#
# integration tests
$ rushx test:intgr
```

## License

This project is proprietary software.

Copyright (c) CO Inc. All rights reserved.
