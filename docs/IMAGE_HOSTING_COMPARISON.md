# Image Hosting Comparison

### Storing images in MongoDB

It is possible to store images in MongoDB but not recommended. If we choose to do so the limit is 512MB including the rest of the data the products take up in the database.
This approach would further require that we use image resizing and heavy compression. For example [WebP](https://developers.google.com/speed/webp). [Tinypng](https://tinypng.com/) allows compression of 500 images/mo for free.

### Free tier specs of image hosting CDNs with APIs

The most professional approach would be to store static assets and file uploads in something like AWS S3.

<!-- prettier-ignore -->
|Hosting|Storage|Bandwidth|Image Processing|Note|
|---|---|---|---|---|
|[upload io](https://upload.io/pricing)|10GB|10GB|Yes||
|[imagur](https://api.imgur.com/)|∞|∞|?|not intended for our purpose and requires registration of our application|
|[cloudinary](https://cloudinary.com/pricing)|25GB|25GB|25K|1 user|
|[imgbb](https://imgbb.com/)|∞|∞|No|has no registration, copyrighted images might be deleted without notice, not private, looks sketchy|
|[Amazon S3](https://aws.amazon.com/s3/)|5GB|100GB, 20 000 GET, 2000 POST||is professional but requires credit card and it can quickly become expensive|
|[imagekit io](https://imagekit.io/plans/)|20GB|20GB|Limited|looks pretty good|
|[freeimagehost](https://freeimage.host/page/api)|∞|∞|No|uploads are public|
|[Sirv](https://sirv.com/pricing/)|0.5GB|2GB/Mo||No|
|[Thumbor](https://github.com/thumbor/thumbor)||||open-source (used by Wikipedia) but it is self hosted|
|[uploadcare](https://uploadcare.com/pricing/)|3GB|30GB|Yes|might require credit card, looks professional
|[cloudimage](https://www.cloudimage.io/en/pricing)|25Gb|25GB||most likely requires credit card (1€ Gb / Overuse)
|[IBM Cloud Object Storage](https://www.ibm.com/cloud/free/storage)|25Gb||No||
|[Oracle Cloud Storage]()|10GB ||No|+ 2 Databases, 4 Arm Compute Instances, might require credit card|
