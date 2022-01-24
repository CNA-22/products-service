# Endpoint Suggestions

These are only suggestions. Feel free to make changes.

**`GET`** `/products/`

-   lists all products
-   (should it feature a search system and a pagination system or just include all results?)

**`GET`** `/product/{unique identifier}`

-   get a product by a unique identifier (part number, SKU, UPC or productId ? (not decided yet))
-   provides more detailed information about a single product

**`POST`** `/product/`

-   add a new product to the database

### Thoughts

Should this API use authentication, be available publicly or only be available to certain IPs?
Should we have a separate endpoint for categories?

### Product

Example JSON object of a product (structure subject to change)

```javascript
{
  name: "",
  description: "",
  sku: "", // stock keeping unit
  upc: "", // universal product code
  brand: "",
  dimensions: "",
  weight: "",
  category: "",
  rating: "",
  regularPrice: "",
  offerPrice: "",
  images: [
    image: {
      title: "",
      alt: "",
      sizes: {
        small: "url",
        medium: "url",
        large: "url",
      }
    },
    ...
  ],
  attachments: [
    "url to file",
    "url to file",
    ...
  ]
}
```
