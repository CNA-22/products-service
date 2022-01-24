import {IProduct} from "../models/Product";

declare module "express-serve-static-core" {
    export interface Request {
        product: IProduct | null | undefined;
    }
}
