export interface Server {
	host: string;
	port: number;
}

export interface Config {
	env: string;
	////// WARN: move it to gitlab secrets //////
	salt: string;
	secret: string;
	////// WARN: move it to gitlab secrets //////
	storage_path: string;
	redis_server: Server;
	http_server: Server;
	allow_origin: Server;
}