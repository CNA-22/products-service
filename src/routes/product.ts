import cloudinary from "cloudinary";
import {Request, RequestHandler, Router} from "express";
import {JSONSchema7} from "json-schema";
import multer from "multer";
import streamifier from "streamifier";

import requestBodyValidator from "../middlewares/requestBodyValidator";
import Product from "../models/Product";
import {evictOtherProperties} from "../utils";

const findProduct: RequestHandler = async (req, res, next) => {
    const product = await Product.findOne({pid: req.params.productId});
    if (product != null) {
        req.product = product;
        next();
    } else {
        res.status(404).send();
    }
};

const generateId = async (): Promise<string> => {
    const pid = Math.round(Math.random() * 1000000000000).toString();
    if ((await Product.findOne({pid}).exec()) == null) {
        return pid;
    } else {
        return await generateId();
    }
};

const imageUploadReceiver: RequestHandler = async (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err !== undefined) {
            res.status(400).json({msg: String(err)});
        } else {
            if (req.file! === undefined) {
                res.status(400).json({msg: "No file provided"});
            } else {
                next();
            }
        }
    });
};

// credit: https://support.cloudinary.com/hc/en-us/community/posts/360007581379-Correct-way-of-uploading-from-buffer-
const uploadFromBuffer = async (req: Request): Promise<any> => {
    return await new Promise((resolve, reject) => {
        const cldUploadStream = cloudinary.v2.uploader.upload_stream(
            (error: any, result: any) => {
                if (result !== undefined) {
                    console.log(result);
                    resolve(result);
                } else {
                    reject(error);
                }
            },
        );
        streamifier.createReadStream(req.file!.buffer).pipe(cldUploadStream);
    });
};

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 1 * 1024 * 1024}, // 1Mb
    fileFilter: (_req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
});

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
        if (req.product){    
            const product = req.product.toObject();
            delete product.__v;
            delete product._id;
            delete product.packageWeight.__v;
            delete product.packageDimensions._id;
            res.status(200).json(product);
        }
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
                pid: await generateId(),
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

product.post(
    "/:productId/image",
    findProduct, // check that product exist
    imageUploadReceiver, // validate and load image data
    async (req, res) => {
        try {
            const cloudinaryResponse = await uploadFromBuffer(req); // send image to cloudinary and await response
            const product = req.product!;
            product.imageURLs.push(cloudinaryResponse.secure_url);

            const updatedProduct = (await product.save()).toObject(); // add image URL to DB
            delete updatedProduct.__v;
            delete updatedProduct._id;
            // @ts-expect-error
            delete updatedProduct.packageDimensions._id;
            res.status(200).json(updatedProduct);
        } catch (err) {
            console.log(err);
            res.status(500);
        }
    },
);

product.delete("/:productId/image", findProduct, async (req, res) => {
    const product = req.product!;
    const image = req.body.image!;

    if (product.imageURLs.includes(image)) {
        try {
            // Removing images from cloudinary will burn trough the free quota much faster than just letting them gather
            // Therefore the feature to remove images from cloudinary exist but is out-commented
            //
            // const cloudinaryImageId = String(image.split("/").slice(-1)[0]!.split(".")[0])
            // const cloudinaryResponse = await cloudinary.v2.api.delete_resources(cloudinaryImageId);

            product.imageURLs = product.imageURLs.filter((item) => {
                return item !== image;
            });
            const updatedProduct = (await product.save()).toObject();
            delete updatedProduct.__v;
            delete updatedProduct._id;
            // @ts-expect-error
            delete updatedProduct.packageDimensions._id;
            res.status(200).json(updatedProduct);
        } catch (error) {
            console.log(error);
            res.status(500).send();
        }
    } else {
        res.status(404).send();
    }
});

export default product;
