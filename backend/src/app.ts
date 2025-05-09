import express, { Router } from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { Config } from "./types/internal/config";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { authorizationMiddleware } from "./middleware/authorization.middleware";
import { dependencyInjectionMiddleware } from "./middleware/deps_injection.middleware";
import { createCorsOptions } from "./config/cors";
import { Dependencies } from "./service";
import { UploadHandler } from "./handlers/upload.handler";

export class App {
	private app: express.Express;
	constructor(dependencies: Dependencies, private cfg: Config, router: Router) {
		this.app = express();
		// Allow to parse json from request body
		this.app.use(express.json());
		// Add possability to upload files
		this.app.use(fileUpload());
		// Add logger for request and response
		this.app.use(loggerMiddleware);
		// Add dependencies
		this.app.use(dependencyInjectionMiddleware(dependencies));
		this.app.use(cors(createCorsOptions(cfg)));
		// Add possability to view static
		this.app.use("/upload", express.static(`./${cfg.public_files_path}`));
		this.app.use(
			"/upload/protected",
			authorizationMiddleware,
			express.static(`./${cfg.protected_files_path}`)
		);
		const uploadRouter = Router();
		uploadRouter.post(
			"/public",
			UploadHandler.handleUpload(
				cfg.public_files_path,
				`http://${cfg.http_server.host}:${cfg.http_server.port}/upload`
			)
		);
		uploadRouter.post(
			"/protected",
			authorizationMiddleware,
			UploadHandler.handleUpload(
				cfg.protected_files_path,
				`http://${cfg.http_server.host}:${cfg.http_server.port}/upload/protected`
			)
		);
		router.use("/send", uploadRouter);

		// Add master router to api routes
		this.app.use("/api", router);

		this.app.get("/ping", (req, res) => {
			res.json({ pong: `environment: ${req.dependencies.cfg.env}` });
		});
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
