import { ErrorRequestHandler } from 'express';

// Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/middlewares/errorHandler.ts#L3
const serverErrorMiddleware = (): ErrorRequestHandler => async (
    error,
    _req,
    res,
    _next,
) => {
    console.error(error);
    res.status(500).json({ status: 'Internal Server Error' });
};

export default serverErrorMiddleware;
