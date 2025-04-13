import express from "express";
import { readConfig } from "./config/config";
import { Storage } from "./repository/storage";
import cors from "cors";
import { createCorsOptions } from "./config/cors";
import { loggerMiddleware } from "./middleware/logger.middleware";
import type { Config } from "./types/config.type";
import { authorizationMiddleware } from "./middleware/authorization.middleware";

const cfg: Config = readConfig("./config/local.yaml");
console.log("config loaded: ", cfg);
const storage: Storage = new Storage(cfg.storage_path);
console.log("storage loaded from path: ", cfg.storage_path);

const app = express();

function startServer() {
	try {
		app.listen(cfg.http_server.port, (err) => {
			console.log(`server is listening on port ${cfg.http_server.port}`);
		});
	} catch (err) {
		console.log(err);
	}
}

// Allow to parse json from request body
app.use(express.json());
// Add logger for request and response
app.use(loggerMiddleware)
// Add possability to view uploaded images
app.use("/upload", express.static("./upload"));
app.use("/upload/user", authorizationMiddleware, express.static("./upload/protected"));

// TODO: init router

const corsOptions = createCorsOptions(cfg);
app.use(
	cors(corsOptions)
);

startServer();
