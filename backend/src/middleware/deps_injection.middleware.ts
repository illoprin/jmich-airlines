import type { BaseRepository } from "../repository/base.repository";

export function dependencyInjectionMiddleware<T>(services: T): any {
	return (req: any, res: any, next: any) => {
		req.services = {
			...services
		}
		next();
	}
}