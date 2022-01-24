import AJV from "ajv";
import {RequestHandler} from "express";
import {JSONSchema7} from "json-schema";

const ajv = new AJV({allErrors: true});

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/middlewares/requestBodyValidator.ts#L7
const requestBodyValidator = (schema: JSONSchema7): RequestHandler => {
    const validateRequestBody = ajv.compile({...schema, $async: true});
    return async (req, res, next) => {
        try {
            await validateRequestBody(req.body);
            next();
        } catch (error) {
            if (error instanceof AJV.ValidationError) {
                console.error(error);
                res.status(400).json({
                    errors: error.errors,
                });
            } else {
                next(error);
            }
        }
    };
};

export default requestBodyValidator;
