# `products-service`

API consumers, the spec is below. Developers and contributors, scroll down for the [Development](#development) section.

## API Specification

### Product Interface

```ts
interface Product {
    pid: string;
    name: string;
    description: string;
    manufacturer: string;
    price: number; // EUR
    chip: string;
    memory: number; // MB
    rating: number; // 0.0 - 1.0
    imageURLs: string[];
    packageDimensions: {
        width: number; // cm
        height: number; // cm
        depth: number; // cm
    };
    packageWeight: number; // kg
}
```

### Authorization With Admin Rights

Some endpoints require authorization.

To authorize, provide the following HTTP header in your request:

```
Authorization: Bearer ${token}
```

where in the place of `${token}` you provide your valid JWT token.

### Endpoints

#### `GET /products`

##### Query Params

<!-- prettier-ignore -->
| Key | Type | Required | Default | Description |
| - | - | - | - | - |
| `page` | unsigned integer | | 0 | What page of products? |
| `size` | unsigned integer | | 10 | How many products per page? |
| `sort` | name, manufacturer, price, chip, memory or rating | | name | What should the products be sorted by? Secondary sorting is always name. A "-" (minus sign) in front of the type denotes descending order. |
| `filter_manufacturer` | string, can be provided multiple times | | | Filter items from manufacturers in this list.
| `min_price` | unsigned float | | | Filter items with a price greater than this.
| `max_price` | unsigned float | | | Filter items with a price greater than this.
| `filter_chip` | string, can be provided multiple times | | | Filter items with chips in this list.
| `min_memory` | unsigned integer | | | Filter items with a memory lesser than this.
| `max_memory` | unsigned integer | | | Filter items with a memory greater than this.
| `min_rating` | unsigned float | | | Filter items with a rating lesser than this.
| `max_rating` | unsigned float | | | Filter items with a rating greater than this.

> 💡 If you're using JavaScript, the [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface can take care of creating a valid query string for you.

##### Response

Content-Type: `application/json`

Body: described below

```ts
interface Page {
    /**
     * The number of the page you requested.
     */
    page: number;
    /**
     * The page size you requested.
     */
    pageSize: number;
    /**
     * The actual size of the page.
     * Equivalent to the length of the items array.
     */
    actualSize: number;
    /**
     * The number of pages available with
     * the current query param configuration.
     */
    totalPagesCount: number;
    /**
     * The total number of items matching
     * the current query param configuration.
     */
    totalItemsCount: number;
    /**
     * The items array.
     */
    items: Product[];
}
```

#### `GET /product/:productId`

##### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The PID of a product. |

##### Response

Content-Type: `application/json`

Body: the `Product` you requested

#### `POST /product`

> 🔒 [Requires authorization with admin rights]

##### Request

Content-Type: `application/json`

Body: described below

```ts
/**
 * An object that conforms to the Product interface,
 * but without the pid and imageURLs properties.
 */
type ProductPostRequestBody = Omit<Product, "pid" | "imageURLs">;
```

##### Response

Content-Type: `application/json`

Body: the newly created `Product`

#### `POST /product/:productId/image`

> 🔒 [Requires authorization with admin rights]

##### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The PID of a product. |

##### Request

Content-Type: `multipart/form-data; boundary=${boundary}`

Body: described below

```
--${boundary}
Content-Disposition: form-data; name='image'; filename='${filename}'
Content-Type: ${mimetype}

${file}
--${boundary}--
```

where in the place of `${boundary}`, `${filename}`, `${mimetype}` and `${file}` you provide your request-specific values.

> 💡 If you're using JavaScript, the [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData) interface can take care of creating a valid multipart body for you.

##### Response

Content-Type: `application/json`

Body: the newly updated `Product`

#### `PUT /product/:productId`

> 🔒 [Requires authorization with admin rights]

##### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

##### Request

Content-Type: `application/json`

Body: described below

```ts
/**
 * An object that conforms to the Product interface,
 * but without the pid and imageURLs properties
 * and with all top-level properties being optional.
 */
type ProductPutRequestBody = Partial<Omit<Product, "id" | "imageURLs">>;
```

Any top-level properties that are not specified in the request body will be left unchanged. Any included top-level property will be overwritten in full.

##### Response

Content-Type: `application/json`

Body: the newly updated `Product`

#### `DELETE /product/:productId`

> 🔒 [Requires authorization with admin rights]

##### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

##### Response

Content-Type: `application/json`

Body: the `Product` that was deleted

#### `DELETE /product/:productId/image`

> 🔒 [Requires authorization with admin rights]

##### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The PID of a product. |

##### Request

Content-Type: `application/json`

Body: described below

```ts
interface ProductImageDeleteRequestBody {
    url: string; // a URL that exists in the product's imageURLs array
}
```

##### Response

Content-Type: `application/json`

Body: the newly updated `Product`

## Development

The `products-service` is implemented as a [Node.js](https://nodejs.org/) server that persists data in a [MongoDB](https://www.mongodb.com/) instance. The source code is written in [TypeScript](https://www.typescriptlang.org/) and uses the [Express](https://expressjs.com/) framework as its "backbone". [`mongoose`](https://mongoosejs.com/) is used for interacting with the database.

### Local Development Environment

Developing and testing the service locally is really easy. All you need to do is run `docker compose up` in the repo directory, granted you have [Docker](https://www.docker.com/) installed (see [Docker Desktop](https://www.docker.com/products/docker-desktop) if you're using macOS or Windows).

The local development environment is powered by [Docker Compose](https://docs.docker.com/compose/) and defined in the [`docker-compose.yaml`](docker-compose.yaml).

Basically the setup consists of two services (Docker containers) being run in parallel:

#### 1. `mongo`

A container that hosts a MongoDB instance. The container is based off the default [MongoDB image](https://hub.docker.com/_/mongo).

The actual database "data" lives on a volume that is mounted to `./db` right in the repo directory. (The `./db` directory is gitignored for obvious reasons.) Removing the `./db` directory will reset the MongoDB instance, which can be useful when developing.

#### 2. `api`

A container that runs the `products-service` directly from the source code, using [`ts-node-dev`](https://www.npmjs.com/package/ts-node-dev). The source code is accessed through a volume that mounts the repo's `./src` directory inside the container. `ts-node-dev` watches the source code for changes and restarts the service when changes are detected.

This container is based on a custom image that is defined [here](Dockerfile).

## Deployments

All deployments consist of a Heroku Node.js Dyno that runs the `products-service` server and a MongoDB Atlas cloud database.

### Staging Deployment

Deployed from [`staging`](https://github.com/CNA-22/products-service/tree/staging) branch.

### Production Environment

Deployed from [`main`](https://github.com/CNA-22/products-service/tree/main) branch.

[requires authorization with admin rights]: #authorization-with-admin-rights
