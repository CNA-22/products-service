# API Specification

## Product Interface

```ts
interface Product {
    id: string; // 12 numerical digits
    name: string;
    description: string;
    manufacturer: string;
    price: number; // EUR
    chip: string;
    memory: number; // MB
    rating: number; // 0.0 - 1.0
    images: string[]; // image IDs
    packageDimensions: {
        x: number; // cm
        y: number; // cm
        z: number; // cm
    };
    packageWeight: number; // kg
}
```

## Authorization With Admin Rights

Some endpoints require authorization.

To authorize, provide the following HTTP header in your request:

```
Authorization: Bearer ${token}
```

where in the place of `${token}` you provide your valid JWT token.

## Endpoints

### `GET /products`

#### Query Params

<!-- prettier-ignore -->
| Key | Type | Required | Default | Description |
| - | - | - | - | - |
| `page` | unsigned integer | | 0 | What page of products? |
| `size` | unsigned integer | | 10 | How many products per page? |
| `sort` | name, manufacturer, price, chip, memory or rating | | name | What should the products be sorted by? Secondary sorting is always name. A "-" (minus sign) in front of the type denotes descending order. |
| `filter_manufacturer` | comma-separated list | | | Filter items from manufacturers in this list. If the manufacturer name itself contains a comma, wrap it in double quotes.
| `min_price` | unsigned float | | | Filter items with a price greater than this.
| `max_price` | unsigned float | | | Filter items with a price greater than this.
| `filter_chip` | comma-separated list | | | Filter items with chips in this list. If the chip name itself contains a comma, wrap it in double quotes.
| `min_memory` | unsigned integer | | | Filter items with a memory lesser than this.
| `max_memory` | unsigned integer | | | Filter items with a memory greater than this.
| `min_rating` | unsigned float | | | Filter items with a rating lesser than this.
| `max_rating` | unsigned float | | | Filter items with a rating greater than this.

#### Response

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

### `GET /product/:productId`

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

#### Response

Content-Type: `application/json`

Body: the `Product` you requested

### `GET /product/:productId/image/:imageId`

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |
| `imageId` | string | The ID of an image of this product. |

#### Response

Content-Type: `image/*`

Body: the image you requested

### `POST /product`

> 🔒 [Requires authorization with admin rights]

#### Request

Content-Type: `application/json`

Body: an object that conforms to the `Product` interface

#### Response

Content-Type: `application/json`

Body: the newly created `Product`

### `POST /product/:productId/image`

> 🔒 [Requires authorization with admin rights]

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

#### Request

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

#### Response

Content-Type: `application/json`

Body: the newly updated `Product`

### `PUT /product/:productId`

> 🔒 [Requires authorization with admin rights]

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

#### Request

Content-Type: `application/json`

Body: described below

```ts
/**
 * An object that conforms to the Product interface,
 * but without the id and images properties
 * and with all top-level properties being optional.
 */
type PutRequestBody = Partial<Omit<Product, 'id' | 'images'>>;
```

Any top-level properties that are not specified in the request body will be left unchanged. Any included top-level property will be overwritten in full.

#### Response

Content-Type: `application/json`

Body: the newly updated `Product`

### `DELETE /product/:productId`

> 🔒 [Requires authorization with admin rights]

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |

#### Response

Content-Type: `application/json`

Body: the `Product` that was deleted

### `DELETE /product/:productId/image/:imageId`

> 🔒 [Requires authorization with admin rights]

#### Path Params

<!-- prettier-ignore -->
| Param | Type | Description |
| - | - | - |
| `productId` | string | The ID of a product. |
| `imageId` | string | The ID of an image of this product. |

#### Response

Content-Type: `application/json`

Body: the newly updated `Product`

[requires authorization with admin rights]: #authorization-with-admin-rights
