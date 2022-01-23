import { Document, Schema, model } from 'mongoose';

// Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/73fde06da599ba311cfc34bb33b287db3800c17d/src/models/RefreshToken.ts#L3
const ProductSchema = new Schema({
    id: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    manufacturer: { type: String, required: true, index: true },
    price: { type: Number, required: true, index: true, min: 0 },
    chip: { type: String, required: true, index: true },
    memory: { type: Number, required: true, index: true, min: 0 },
    rating: { type: Number, required: true, index: true, min: 0, max: 1 },
    imageURLs: { type: [String] },
    packageDimensions: {
        type: {
            width: { type: Number, required: true, min: 0 },
            height: { type: Number, required: true, min: 0 },
            depth: { type: Number, required: true, min: 0 },
        },
        required: true,
    },
    packageWeight: { type: Number, required: true, min: 0 },
});

interface IProductSchema extends Document {
    id: string;
    name: string;
    description: string;
    manufacturer: string;
    price: number;
    chip: string;
    memory: number;
    rating: number;
    imageURLs: string[];
    packageDimensions: {
        width: number;
        height: number;
        depth: number;
    };
    packageWeight: number;
}

interface IProductBase extends IProductSchema {}

export interface IProduct extends IProductBase {}

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
