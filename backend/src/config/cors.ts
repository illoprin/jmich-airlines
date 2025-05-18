import type { CorsOptions } from "cors";
import type { Config } from "@/types/internal/config";

export function createCorsOptions(cfg: Config): CorsOptions {
  const allowedOrigins: string[] = [
    `http://localhost`,
  ];

  return { // fuck cors
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
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
