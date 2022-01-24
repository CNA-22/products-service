import mongoose from "mongoose";

import {allFulfilled, requireEnvVar} from "./utils";

const credentialsToEnvVarNames = [
    ["protocol", "MONGO_PROTOCOL"],
    ["rootUsername", "MONGO_INITDB_ROOT_USERNAME"],
    ["rootPassword", "MONGO_INITDB_ROOT_PASSWORD"],
    ["containerName", "MONGO_CONTAINER_NAME"],
    ["dbName", "MONGO_INITDB_DATABASE"],
    ["query", "MONGO_QUERY"],
];

// From https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/d63e934e69fb3806abd3b3991578f1b9f45becfc/src/connectToDB.ts#L12
const connectToDB = async (): Promise<void> => {
    const {protocol, rootUsername, rootPassword, containerName, dbName, query} =
        Object.fromEntries(
            await allFulfilled(
                credentialsToEnvVarNames.map(
                    async ([key, envVarName]): Promise<[string, string]> => [
                        key,
                        requireEnvVar(envVarName),
                    ],
                ),
            ).catch(() => {
                throw new Error(
                    "Required environment variables were undefined.",
                );
            }),
        );
    await mongoose.connect(
        `${protocol}://${rootUsername}:${rootPassword}@${containerName}/${dbName}?${query}`,
        {ignoreUndefined: true},
    );
    console.log("Successfully connected to MongoDB.");
};

export default connectToDB;
