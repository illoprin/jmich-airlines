export interface Server {
	host: string;
	port: number;
}

export interface Config {
	env: string;
	storage_path: string;
	redis_server: Server;
	http_server: Server;
	allow_origin: Server;
}