"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const storage_1 = require("./repository/storage");
const cors_1 = __importDefault(require("cors"));
const cors_2 = require("./config/cors");
const logger_middleware_1 = require("./middleware/logger.middleware");
const cfg = (0, config_1.readConfig)("./config/local.yaml");
console.log("Config loaded: ", cfg);
const storage = new storage_1.Storage(cfg.storage_path);
const app = (0, express_1.default)();
function startServer() {
    try {
        app.listen(cfg.http_server.port, (err) => {
            console.log(`server is listening on port ${cfg.http_server.port}`);
        });
    }
    catch (err) {
        console.log(err);
    }
}
// Allow to parse json from request body
app.use(express_1.default.json());
app.use(logger_middleware_1.loggerMiddleware);
// TODO: init router
app.get('/', (req, res) => {
    const hheader = req.get('Ping');
    if (hheader == "1") {
        res.status(200).json({ message: "Pong" });
        return;
    }
    res.status(400).json({ message: "add 'Ping' header" });
});
const corsOptions = (0, cors_2.getCorsOptions)(cfg);
app.use((0, cors_1.default)(corsOptions));
startServer();
