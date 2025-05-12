export interface Server {
  host: string;
  port: number;
}

export interface Config {
  env: string;
  ////// WARN: move it to gitlab secrets //////
  salt: number;
  secret: string;
  ////// WARN: move it to gitlab secrets //////
  storage_path: string;
  min_required_role: number; // Min required role to get all personal data
  public_files_path: string;
  protected_files_path: string;
  redis_server: Server;
  http_server: Server;
  allow_origin: Server;
}
