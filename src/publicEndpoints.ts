import { pathFilter } from 'express-unless';
import { pathToRegexp } from 'path-to-regexp';

const publicEndpoints: pathFilter[] = [
    '/products',
    { url: pathToRegexp('/product/:productId'), method: 'GET' },
];

export default publicEndpoints;
