export interface Server {
	host: string;
	port: number;
}

export interface Config {
	env: string;
	storage_path: string;
	http_server: Server;
	allow_origin: Server;
}