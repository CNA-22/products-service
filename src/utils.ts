import { Query } from 'express-serve-static-core';

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/util.ts#L1
export const isNonEmptyString = (any: any): any is string =>
    typeof any === 'string' && any.length !== 0;

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/util.ts#L4
export const requireEnvVar = (envVarName: string): string => {
    const envVar = process.env[envVarName];
    if (isNonEmptyString(envVar)) {
        return envVar;
    } else {
        throw new Error(
            `The environment variable ${envVarName} was not defined.`,
        );
    }
};

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/util.ts#L13
export const allFulfilled = async <T>(
    promises: Array<Promise<T>>,
): Promise<T[]> => {
    const results = await Promise.allSettled(promises);
    const values: T[] = [];
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            values.push(result.value);
        } else {
            console.error(result.reason.message);
        }
    });
    if (values.length === results.length) {
        return values;
    } else {
        throw new Error('Promises rejected.');
    }
};

/**
 * If a query param has been specified multiple times,
 * which in other words means it's represented as an array in Express's `req.query`,
 * then this function will return the last value in that array.
 * Else, if it's a string or undefined, it will return that.
 *
 * This function will not work unless the Express app that created the `req` has "query parser" set to "simple".
 * (See https://masteringjs.io/tutorials/express/query-parameters#objects-and-arrays-in-query-strings.)
 *
 * @param queryParam A query param as they are represented in Express's req.query object.
 * @throws {TypeError} Argument queryParam must be either a string, an array of strings or undefined.
 * @returns The "rightmost" value that the query param was specified as.
 */
export const queryParamAsString = (
    queryParam: Query[string],
): string | undefined => {
    if (queryParam != null) {
        if (typeof queryParam === 'string') {
            return queryParam;
        } else if (typeof queryParam === 'object') {
            if (Array.isArray(queryParam)) {
                // @ts-expect-error
                return queryParam[queryParam.length - 1];
            } else {
                throw new TypeError(
                    'Argument queryParam must be either a string, an array of strings or undefined.',
                );
            }
        }
    }
    return undefined;
};

export const evictOtherProperties = (
    object: Record<string, any>,
    whitelistedProperties: string[],
): object => {
    let cleanObject: Record<string, any> = {};
    for (const whitelistedProperty of whitelistedProperties) {
        cleanObject[whitelistedProperty] = object[whitelistedProperty];
    }
    return cleanObject;
};
