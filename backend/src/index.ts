import express from "express";
import { readConfig } from "./config/config";
import { Storage } from "./repository/storage";
import cors from "cors";
import { createCorsOptions } from "./config/cors";
import { loggerMiddleware } from "./middleware/logger.middleware";
import type { Config } from "./types/config.type";
import { authorizationMiddleware } from "./middleware/authorization.middleware";
import { UserRepository } from "./repository/user.repository";
import { PaymentRepository } from "./repository/payment.repository";
import { dependencyInjectionMiddleware } from "./middleware/deps_injection.middleware";
import { UserService } from "./service/user.service";
import { UserHandler } from "./handlers/user.handler";
import { PaymentHandler } from "./handlers/payment.handler";
import { Dependencies } from "./types/middlewaree.type";

// Load config
const cfg: Config = readConfig("./config/local.yaml");
console.log("config loaded: ", cfg);

// Connect to storage
const storage: Storage = new Storage(cfg.storage_path);
console.log("storage loaded from path: ", cfg.storage_path);

// Create storage repositories
const userRepo: UserRepository = new UserRepository(storage);
const paymentRepo: PaymentRepository = new PaymentRepository(storage);

// Create services
const userService: UserService = new UserService(userRepo, paymentRepo, cfg);

// TODO: create redis server connection

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
app.use(loggerMiddleware);
// Add possability to view static
app.use("/upload", express.static("./upload"));
app.use(
	"/upload/user",
	authorizationMiddleware,
	express.static("./upload/protected")
);

// Add repositories to Express App dependencies
const dependencies: Dependencies = {
	userService,
	cfg,
};
app.use(dependencyInjectionMiddleware(dependencies));

app.use("/user", UserHandler.router());
app.use("/user/payment", PaymentHandler.router());

const corsOptions = createCorsOptions(cfg);
app.use(cors(corsOptions));

startServer();
