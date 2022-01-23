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

export const dearrayifyQueryParam = (
    queryParam: Query[string],
): string | undefined => {
    if (queryParam != null) {
        if (typeof queryParam === 'string') {
            return queryParam;
        } else if (typeof queryParam === 'object') {
            if (
                Array.isArray(queryParam) &&
                typeof queryParam[0] === 'string'
            ) {
                return (queryParam as string[])[queryParam.length - 1];
            } else {
                throw new Error(
                    'queryParam was of unfamiliar ParsedQs | ParsedQs[] type.',
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
