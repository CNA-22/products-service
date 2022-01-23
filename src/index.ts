import connectToDB from './connectToDB';
import express from 'express';
import morgan from 'morgan';
import tokenVerifyingMiddleware from './middlewares/tokenVerifyingMiddleware';
import publicEndpoints from './publicEndpoints';
import { requireEnvVar } from './utils';
import serverErrorMiddleware from './middlewares/serverErrorMiddleware';
import jsonMiddleware from './middlewares/jsonMiddleware';
import products from './routes/products';
import product from './routes/product';

// Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/index.ts#L20
(async () => {
    await connectToDB();
    const secret = requireEnvVar('JWT_SECRET');
    const port = process.env.PORT ?? 3000;
    express()
        .use(morgan('dev'))
        .use(tokenVerifyingMiddleware({ secret, publicEndpoints }))
        .use(jsonMiddleware())
        .use('/products', products)
        .use('/product', product)
        .use(serverErrorMiddleware())
        .listen(port, () => console.log(`Server listening on port ${port}.`));
})().catch(error => {
    console.error(error);
    process.exit(1);
});
