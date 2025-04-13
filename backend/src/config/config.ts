import { readFileSync } from "node:fs" 
import { parse } from 'yaml'
import type { Config } from "../types/config.type";

export function readConfig(configPath: string) : Config {
	try {
		const file = readFileSync(configPath, "utf-8");
		const config : Config = parse(file);
		return config
	} catch (err) {
		const parseErr = err as Error;
		throw new Error(
			`could not parse config whith path ${configPath}; error: ${parseErr.message}`
		);
	}
}