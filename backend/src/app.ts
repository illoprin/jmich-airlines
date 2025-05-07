import express, { Router } from "express";
import cors from "cors";
import { Config } from "./types/config.type";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { authorizationMiddleware } from "./middleware/authorization.middleware";
import { dependencyInjectionMiddleware } from "./middleware/deps_injection.middleware";
import { createCorsOptions } from "./config/cors";
import { Dependencies } from "./service";

export class App {
	private app: express.Express;
	constructor(dependencies: Dependencies, private cfg: Config, router: Router) {
		this.app = express();
		// Allow to parse json from request body
		this.app.use(express.json());
		// Add logger for request and response
		this.app.use(loggerMiddleware);
		// Add dependencies
		this.app.use(dependencyInjectionMiddleware(dependencies))
		this.app.use(cors(createCorsOptions(cfg)));
		// Add possability to view static
		this.app.use("/upload", express.static(`./${cfg.public_files_path}`));
		// Add authorized users possability to view personal data
		this.app.use(
			"/upload/user",
			authorizationMiddleware,
			express.static(`./${this.cfg.user_files_path}`)
		);
		this.app.use(
			"/upload/booking",
			authorizationMiddleware,
			express.static(`./${this.cfg.booking_files_path}`)
		);

		// Add master router to api routes
		this.app.use("/api", router);

		this.app.get("/ping", (req, res) => {
			res.json({ pong: `environment: ${req.dependencies.cfg.env}` });
		})
	}

	public start() {
		try {
			this.app.listen(this.cfg.http_server.port, (err) => {
				console.log(`server is listening on port ${this.cfg.http_server.port}`);
			});
		} catch (err) {
			console.log(err);
		}
	}
}
