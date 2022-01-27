import {RequestHandler, Router} from "express";
import {JSONSchema7} from "json-schema";

import requestBodyValidator from "../middlewares/requestBodyValidator";
import Product from "../models/Product";
import {evictOtherProperties} from "../utils";

const findProduct: RequestHandler = async (req, res, next) => {
    const product = await Product.findOne({id: req.params.productId});
    if (product != null) {
        req.product = product;
        next();
    } else {
        res.status(404).send();
    }
};

const generateId = async (): Promise<string> => {
    const id = Math.round(Math.random() * 1000000000000).toString();
    if ((await Product.findOne({id}).exec()) == null) {
        return id;
    } else {
        return await generateId();
    }
};

const productRequestBodySchema: JSONSchema7 = {
    type: "object",
    properties: {
        name: {type: "string"},
        description: {type: "string"},
        manufacturer: {type: "string"},
        price: {type: "number", exclusiveMinimum: 0},
        chip: {type: "string"},
        memory: {type: "number", exclusiveMinimum: 0},
        rating: {type: "number", minimum: 0, maximum: 1},
        packageDimensions: {
            type: "object",
            properties: {
                width: {type: "number", exclusiveMinimum: 0},
                height: {type: "number", exclusiveMinimum: 0},
                depth: {type: "number", exclusiveMinimum: 0},
            },
            required: ["width", "height", "depth"],
            additionalProperties: false,
        },
        packageWeight: {type: "number", exclusiveMinimum: 0},
    },
};

const properties = Object.keys(productRequestBodySchema.properties!);

const product = Router();

product.get(
    "/:productId",
    findProduct,
    requestBodyValidator(productRequestBodySchema),
    async (req, res) => {
        // Do stuff
        const product = req.product;
        res.status(200).json({
            product,
        });
    }
);

product.post(
    "/",
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
        res.status(201).json(product);
    },
);

product.put(
    "/:productId",
    findProduct,
    requestBodyValidator(productRequestBodySchema),
    async (req, res) => {
        const product = req.product!;
        for (const [key, value] of Object.entries(
            evictOtherProperties(req.body, properties),
        )) {
            // @ts-expect-error
            product[key] = value;
        }
        const updatedProduct = (await product.save()).toObject();
        delete updatedProduct.__v;
        delete updatedProduct._id;
        // @ts-expect-error
        delete updatedProduct.packageDimensions._id;
        res.status(200).json(updatedProduct);
    },
);

product.delete("/:productId", findProduct, async (req, res) => {
    const deletedProduct = (await req.product!.deleteOne()).toObject();
    delete deletedProduct.__v;
    delete deletedProduct._id;
    delete deletedProduct.packageDimensions._id;
    res.status(200).json(deletedProduct);
});

export default product;
