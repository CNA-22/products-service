import {ErrorRequestHandler, RequestHandler, json} from "express";

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/middlewares/jsonMiddleware.ts#L3
const jsonMiddleware = (): [RequestHandler, ErrorRequestHandler] => [
    json(),
    (error, _req, res, next) => {
        if (error.name === "SyntaxError") {
            res.status(400).json({error: error.message});
            return;
        }
        next(error);
    },
];

export default jsonMiddleware;
