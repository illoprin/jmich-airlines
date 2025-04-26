import type { CorsOptions } from "cors";
import type { Config } from "../types/config.type";

export function createCorsOptions(cfg: Config) : CorsOptions {
	const allowedOrigins: string[] = [
		`http://${cfg.allow_origin.host}:${cfg.allow_origin.port}`,
	];

	return {
		origin: (
			origin: string | undefined,
			callback: (err: Error | null, allow?: boolean) => void
		) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.warn(`CORS blocked origin ${origin}`);
				callback(new Error("Not allowed by CORS"), false);
			}
		},
		optionsSuccessStatus: 200,
	};
}