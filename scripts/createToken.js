#!/usr/bin/env node

const path = require("path");

const jwt = require("jsonwebtoken");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env.development"),
});
(async () => {
    const secret = process.env.JWT_SECRET;
    if (secret == null) {
        throw new Error("The environment variable JWT_SECRET was not defined.");
    }
    console.log(jwt.sign("developmentToken", process.env.JWT_SECRET));
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
