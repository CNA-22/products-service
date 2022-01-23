# `products-service`

API consumers, the spec is below. Developers and contributors, scroll down for the [Development and Contribution](#development-and-contribution) section.

## API Specification

```ts
// TODO: move spec here
```

## Development and Contribution

This package was initially set up using [TSDX](https://tsdx.io/). Please familiarize yourself with TSDX by checking out their site and by reading the [TSDX User Guide](docs/TSDX_USER_GUIDE.md).

The `products-service` is implemented as a [Node.js](https://nodejs.org/) server that persists data in a [MongoDB](https://www.mongodb.com/) instance. The source code is written in [TypeScript](https://www.typescriptlang.org/) and uses the [Express](https://expressjs.com/) framework as its "backbone". [`mongoose`](https://mongoosejs.com/) is used for interacting with the database.

### Development Environment

Developing and testing the service locally is really easy. All you need to do is run `docker compose up` in the repo directory, granted you have [Docker](https://www.docker.com/) installed (see [Docker Desktop](https://www.docker.com/products/docker-desktop) if you're using macOS or Windows).

The local development environment is powered by [Docker Compose](https://docs.docker.com/compose/) and defined in the [`docker-compose.yaml`](docker-compose.yaml).

Basically the setup consists of two services (Docker containers) being run in parallel:

#### 1. `mongo`

A container that hosts a MongoDB instance. The container is based off the default [MongoDB image](https://hub.docker.com/_/mongo).

The actual database "data" lives on a volume that is mounted to `./db` right in the repo directory. (The `./db` directory is gitignored for obvious reasons.) Removing the `./db` directory will reset the MongoDB instance, which can be useful when developing.

#### 2. `api`

A container that runs the `products-service` directly from the source code, using [`ts-node-dev`](https://www.npmjs.com/package/ts-node-dev). The source code is accessed through a volume that mounts the repo's `./src` directory inside the container. `ts-node-dev` watches the source code for changes and restarts the service when changes are detected.

This container is based on a custom image that is defined [here](Dockerfile).

### Production Environment

The production environment consists of a Heroku Node.js Dyno that runs the `products-service` server and a MongoDB Atlas cloud database.

```ts
// TODO: expand upon this
```

### Contribution Guidelines

```ts
// TODO: expand upon this
```
