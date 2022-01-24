import {ErrorRequestHandler, RequestHandler} from "express";
import expressJWT from "express-jwt";
import {pathFilter} from "express-unless";

export interface TokenVerifyingMiddlewareConfiguration {
    secret: string;
    publicEndpoints?: pathFilter[];
}

// Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/routes/user/token.ts#L40
const tokenVerifyingMiddleware = ({
    secret,
    publicEndpoints,
}: TokenVerifyingMiddlewareConfiguration): [
    RequestHandler,
    ErrorRequestHandler,
] => [
    expressJWT({
        secret,
        algorithms: ["HS256"],
    }).unless({
        path: publicEndpoints,
    }),
    (error, _req, res, next) => {
        if (error.name === "UnauthorizedError") {
            res.status(401).send();
            return;
        }
        next(error);
    },
];

export default tokenVerifyingMiddleware;
