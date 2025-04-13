"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = loggerMiddleware;
function loggerMiddleware(req, res, next) {
    const t1 = Date.now();
    res.on("finish", () => {
        const contentLen = res.getHeader('Content-Length');
        const responseSize = contentLen ? contentLen : 0;
        const duration = Date.now() - t1;
        const { method, originalUrl } = req;
        const { statusCode } = res;
        console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - ${statusCode} | ${duration}ms | ${responseSize || "?"} bytes`);
    });
    next();
}
