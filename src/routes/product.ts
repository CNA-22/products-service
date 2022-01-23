import { Router } from 'express';
import { JSONSchema7 } from 'json-schema';
import requestBodyValidator from '../middlewares/requestBodyValidator';

import Product from '../models/Product';
import { evictOtherProperties } from '../utils';

const generateId = async (): Promise<string> => {
    const id = Math.round(Math.random() * 1000000000000).toString();
    if ((await Product.findOne({ id }).exec()) == null) {
        return id;
    } else {
        return await generateId();
    }
};

const productRequestBodySchema: JSONSchema7 = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        manufacturer: { type: 'string' },
        price: { type: 'number', exclusiveMinimum: 0 },
        chip: { type: 'string' },
        memory: { type: 'number', exclusiveMinimum: 0 },
        rating: { type: 'number', minimum: 0, maximum: 1 },
        packageDimensions: {
            type: 'object',
            properties: {
                width: { type: 'number', exclusiveMinimum: 0 },
                height: { type: 'number', exclusiveMinimum: 0 },
                depth: { type: 'number', exclusiveMinimum: 0 },
            },
            required: ['width', 'height', 'depth'],
            additionalProperties: false,
        },
        packageWeight: { type: 'number', exclusiveMinimum: 0 },
    },
};

const properties = Object.keys(productRequestBodySchema.properties!);

const product = Router();

product.post(
    '/',
    requestBodyValidator({
        ...productRequestBodySchema,
        required: properties,
    }),
    async (req, res) => {
        const product = (
            await new Product({
                id: await generateId(),
                ...evictOtherProperties(req.body, properties),
            }).save()
        ).toObject();
        delete product.__v;
        delete product._id;
        // @ts-expect-error
        delete product.packageDimensions._id;
        res.status(201).json({ status: 'Created', contents: product });
    },
);

export default product;
