import {Query} from "express-serve-static-core";

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/util.ts#L1
export const isNonEmptyString = (any: any): any is string =>
    typeof any === "string" && any.length !== 0;

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
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            values.push(result.value);
        } else {
            console.error(result.reason.message);
        }
    });
    if (values.length === results.length) {
        return values;
    } else {
        throw new Error("Promises rejected.");
    }
};

export const betterParseFloat = (any: any): number | null | undefined =>
    any != null ? parseFloat(any) : any;

export const betterIsArray = (any: any): any is any[] => Array.isArray(any);

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
 * @returns The "rightmost" value that the query param was specified as or undefined.
 */
export const queryParamAsString = (
    queryParam: Query[string],
): string | undefined => {
    if (typeof queryParam === "undefined") {
        return queryParam;
    }
    if (typeof queryParam === "string") {
        return queryParam;
    }
    if (typeof queryParam === "object") {
        if (betterIsArray(queryParam)) {
            const lastElement = queryParam[queryParam.length - 1];
            if (typeof lastElement === "string") {
                return lastElement;
            }
        }
    }
    throw new TypeError(
        "Argument queryParam must be either a string, an array of strings or undefined.",
    );
};

/**
 * If a query param has been specified once,
 * then this function will wrap it in an array and return that.
 * Else, if it has been specified multiple times,
 * which in other words means it's represented as an array in Express's `req.query`,
 * then this function will return that array.
 * If the query param is undefined, it will return that.
 *
 * This function will not work unless the Express app that created the `req` has "query parser" set to "simple".
 * (See https://masteringjs.io/tutorials/express/query-parameters#objects-and-arrays-in-query-strings.)
 *
 * @param queryParam A query param as they are represented in Express's req.query object.
 * @throws {TypeError} Argument queryParam must be either a string, an array of strings or undefined.
 * @returns An array containing the query param(s) or undefined
 */
export const queryParamAsArray = (
    queryParam: Query[string],
): string[] | undefined => {
    if (queryParam != null) {
        if (typeof queryParam === "object") {
            if (
                betterIsArray(queryParam) &&
                (queryParam as any[]).every(
                    (element) => typeof element === "string",
                )
            ) {
                return queryParam as string[];
            } else {
                throw new TypeError(
                    "Argument queryParam must be either a string, an array of strings or undefined.",
                );
            }
        } else {
            return [queryParam];
        }
    } else {
        return undefined;
    }
};

export const evictOtherProperties = (
    object: Record<string, any>,
    whitelistedProperties: string[],
): object => {
    const cleanObject: Record<string, any> = {};
    for (const whitelistedProperty of whitelistedProperties) {
        const value = object[whitelistedProperty];
        if (value !== undefined) {
            cleanObject[whitelistedProperty] = value;
        }
    }
    return cleanObject;
};

export const ignorableQueryField = (
    object: Record<string, any>,
): Record<string, any> | undefined => {
    const undefinedPropsEvicted: Record<string, any> = {};
    for (const [key, value] of Object.entries(object)) {
        if (value != null) {
            undefinedPropsEvicted[key] = value;
        }
    }
    if (Object.keys(undefinedPropsEvicted).length > 0) {
        return undefinedPropsEvicted;
    } else {
        return undefined;
    }
};
