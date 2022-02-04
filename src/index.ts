import express from "express";
import morgan from "morgan";
import cors from "cors";

import connectToDB from "./connectToDB";
import jsonMiddleware from "./middlewares/jsonMiddleware";
import serverErrorMiddleware from "./middlewares/serverErrorMiddleware";
import tokenVerifyingMiddleware from "./middlewares/tokenVerifyingMiddleware";
import publicEndpoints from "./publicEndpoints";
import product from "./routes/product";
import products from "./routes/products";
import {requireEnvVar} from "./utils";

var allowed_origins = requireEnvVar("ORIGINS").split(' ');

// Inspired by https://github.com/DanielGiljam/ia-2-017-0-lodge-broker/blob/2780a9d3d557f1fcda0d3610dd04da342934f32c/src/index.ts#L20
(async () => {
    await connectToDB();
    const secret = requireEnvVar("JWT_SECRET");
    const port = process.env.PORT ?? 3000;
    express()
        .set("query parser", "simple")
        .use(cors({
            origin: function (origin, callback) {
                // https://www.cluemediator.com/how-to-enable-cors-for-multiple-domains-in-node-js
                // bypass the requests with no origin (like curl requests, mobile apps, etc )
                if (!origin) return callback(null, true);
                if (allowed_origins.indexOf(origin) === -1) {
                var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
                return callback(new Error(msg), false);
              }
              return callback(null, true);
            }
        }))
        .use(morgan("dev"))
        .use(tokenVerifyingMiddleware({secret, publicEndpoints}))
        .use(jsonMiddleware())
        .use("/products", products)
        .use("/product", product)
        .use(serverErrorMiddleware())
        .listen(port, () => console.log(`Server listening on port ${port}.`));
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
