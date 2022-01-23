import { Router } from 'express';
import { Query } from 'express-serve-static-core';
import { JSONSchema7 } from 'json-schema';
import requestBodyValidator from '../middlewares/requestBodyValidator';

import Product from '../models/Product';
import {
    betterParseFloat as bpf,
    queryParamAsArray as qpAsArr,
    queryParamAsString as qpAsStr,
    ignorableQueryField as iqf,
} from '../utils';

const queryParamsSchema: JSONSchema7 = {
    type: 'object',
    properties: {
        page: { type: 'number', minimum: 0, multipleOf: 1 },
        size: { type: 'number', minimum: 0, multipleOf: 1 },
        sort: {
            enum: [
                'name',
                'manufacturer',
                'price',
                'chip',
                'memory',
                'rating',
            ].flatMap((element: string) => [element, '-' + element]),
        },
        filter_manufacturer: { type: 'array', items: { type: 'string' } },
        min_price: { type: 'number', minimum: 0 },
        max_price: { type: 'number', minimum: 0 },
        filter_chip: { type: 'array', items: { type: 'string' } },
        min_memory: { type: 'number', minimum: 0, multipleOf: 1 },
        max_memory: { type: 'number', minimum: 0, multipleOf: 1 },
        min_rating: { type: 'number', minimum: 0, maximum: 1 },
        max_rating: { type: 'number', minimum: 0, maximum: 1 },
    },
};

const queryParamParsers = {
    page: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    size: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    sort: (queryParam: Query[string]) => qpAsStr(queryParam),
    filter_manufacturer: (queryParam: Query[string]) => qpAsArr(queryParam),
    min_price: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    max_price: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    filter_chip: (queryParam: Query[string]) => qpAsArr(queryParam),
    min_memory: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    max_memory: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    min_rating: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
    max_rating: (queryParam: Query[string]) => bpf(qpAsStr(queryParam)!),
};

const products = Router();

products.get(
    '/',
    (req, _res, next) => {
        for (const [key, parser] of Object.entries(queryParamParsers)) {
            req.body[key] = parser(req.query[key]);
        }
        next();
    },
    requestBodyValidator(queryParamsSchema),
    async (req, res) => {
        const {
            page = 0,
            size = 10,
            sort,
            filter_manufacturer,
            min_price,
            max_price,
            filter_chip,
            min_memory,
            max_memory,
            min_rating,
            max_rating,
        } = req.body;
        let sortBy = sort;
        let direction = 'ascending';
        if (sortBy?.startsWith('-')) {
            sortBy = sortBy.slice(1);
            direction = 'descending';
        }
        const query = {
            manufacturer: iqf({ $nin: filter_manufacturer }),
            price: iqf({ $gte: min_price, $lte: max_price }),
            chip: iqf({ $nin: filter_chip }),
            memory: iqf({ $gte: min_memory, $lte: max_memory }),
            rating: iqf({ $gte: min_rating, $lte: max_rating }),
        };
        const count = await Product.count(query);
        const items = await Product.find(query, {
            __v: false,
            _id: false,
            'packageDimensions._id': false,
        })
            .sort(sortBy != null ? { [sortBy]: direction } : undefined)
            .skip(page * size)
            .limit(size);
        res.status(200).json({
            page,
            pageSize: size,
            actualSize: items.length,
            totalPagesCount: Math.ceil(count / size),
            totalItemsCount: count,
            items,
        });
    },
);

export default products;
