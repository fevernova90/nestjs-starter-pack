# Nestjs Muhaimin's Starter Pack

This starter pack includes:

- Nestjs 8
- TypeORM (postgres)
- Swagger OpenAPI (exposed by default) with CLI plugins enabled
- Husky and lint-staged for pre-commit hook
- Docker ready

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database ORM (TypeORM)

```bash
# Generate migration files based on entities
$ npm run migration:generate

# Run the migration on database (db URI in ormconfig.ts)
$ npm run migration:run
```

## Docker

Inspect and change these files:

- .dockerignore
- Dockerfile
- test-local-docker.sh
- deploy-staging.sh
- deploy-production.sh

## Disclaimer

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
