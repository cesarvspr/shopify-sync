# Product API Shopify

This application is capable of fetching entire shopify stores concurrently
using background jobs to add products to database, also proving jobs status info
on specific endpoint alongside with classic DELETE
implementation.

### Quick start

Install dependencies

```sh
yarn install
```

Prisma clients lives inside ./node_modules, generating the client is usually needed

```sh
yarn prisma generate
```

To start the app in dev mode, using the docker-compose.yml provided is
recommended but not required

```sh
docker-compose up
yarn prisma migrate deploy
```

> ## Note
>
> If not using the docker-compose for development, be aware that a postgres and
> redis instance should be specified in the app .env

For production mode

```sh
yarn start:all
```

## Environment variables

Few variables are required regarding the listening port, database connection and
redis address/port. Check the .env.local for more context.

## Postman collection

A postman collection is provided on project root. Feel free to make use of it
alongside the docker-compose, otherwise you might need to adjust the port of the
request.

## Core features

- **Process concurrently:** Request data the product sync queue so fastify instance
  does not have to wait database response and the heavy part is executed by the
  worker. The queue worker is powered by [bull](https://github.com/OptimalBits/bull).
- **Good practices:** Even being a small application for handling network fetching
  and database inserts. it uses a very straight forward DDD approach within a
  [fastify](http://github.com/fastify/**fastify**) based application with
  reusable code and unit test/integration friendly.
- **Highly performant:** As far as I know, Fastify is one of the fastest web
  frameworks in town, depending on the code complexity we can serve up to 76+
  thousand requests per second.
- **Extendible:** Fastify is fully extensible via its hooks, plugins and
  decorators.
- **Schema based:** Not mandatory but I recommend to use [JSON
  Schema](https://json-schema.org/) to validate your routes and serialize
  outputs, internally Fastify compiles the schema in a highly performant
  function.
- **Logging:** logs are extremely important but are costly; we chose the best
  logger to almost remove this cost, [Pino](https://github.com/pinojs/pino)!
- **Developer friendly:** This application is built to be very expressive and help
  other developers in their daily use or onboarding, without sacrificing
  performance and
  security.

## Project structure

```tree
src
├── application
│   ├── application.error.ts
│   ├── product.application.ts
│   └── validation.error.ts
├── domain
│   ├── context.ts
│   ├── errors
│   │   ├── domain.error.ts
│   │   └── index.ts
│   ├── models
│   │   ├── private
│   │   │   ├── index.ts
│   │   │   ├── job
│   │   │   │   ├── Job.ts
│   │   │   │   └── index.ts
│   │   │   └── product
│   │   │       ├── Product.ts
│   │   │       └── index.ts
│   │   └── public
│   │       └── index.ts
│   ├── repositories
│   │   ├── order.repository.ts
│   │   └── product.repository.ts
│   ├── services
│   │   ├── config.service.ts
│   │   ├── logger.service.ts
│   │   └── shopify.service.ts
│   └── utils
│       └── mappers.ts
├── implementation
│   ├── fastify
│   │   ├── fastify.config.ts
│   │   ├── mutations
│   │   │   ├── abstract.mutation.ts
│   │   │   └── product.mutation.ts
│   │   ├── plugin
│   │   │   └── error.ts
│   │   ├── routes.ts
│   │   └── schemas
│   │       ├── index.ts
│   │       └── products.schema.ts
│   ├── node
│   │   └── config.service.ts
│   ├── pino
│   │   ├── logger.service.ts
│   │   └── pino.config.ts
│   ├── prisma
│   │   ├── domain.mapper.ts
│   │   ├── order.repository.ts
│   │   ├── persistence.error.ts
│   │   └── product.repository.ts
│   ├── queue
│   │   ├── index.ts
│   │   ├── opts.ts
│   │   └── product.queue.ts
│   └── shopify
│       └── shopify.service.ts
├── queue.ts
└── server.ts
└── tests
```
