"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorsOptions = getCorsOptions;
function getCorsOptions(cfg) {
    const allowedOrigins = [
        `http://${cfg.allow_origin.host}:${cfg.allow_origin.port}`,
    ];
    return {
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"), false);
            }
        },
        optionsSuccessStatus: 200,
    };
}
