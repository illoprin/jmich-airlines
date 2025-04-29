import { writeFile, writeFileSync } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { FileSaveError } from "../../types/service.type";
import { File } from "node:buffer";

export function saveBufferToFile(
	buffer: Buffer,
	filePath: string,
	extension: string,
	maxBufferLength: number = 10_485_760
): string {
	if (buffer.length > maxBufferLength) {
		throw new FileSaveError("too large file");
	}
	// Create uuid file name
	const fileName = `${uuidv4()}.${extension}`;
	// Get root dir of nodejs process
	const rootDir = process.cwd();
	// Define full path to file
	const fullPath = path.resolve(rootDir, filePath, fileName);

	try {
		// Save file
		writeFileSync(fullPath, buffer);
		return fileName;
	} catch (err) {
		console.error("could save image from buffer ", err);
		throw new FileSaveError("unable to save file from buffer");
	}
}

export function extractAndCheckFileExtension(
	file: File,
	allowedExtensions: string[]
): { extension: string; allowed: boolean } {
	const ext = file.name.split(".")[1];
	if (!allowedExtensions.includes(ext)) {
		return {
			extension: ext,
			allowed: false,
		};
	}
	return {
		extension: ext,
		allowed: true,
	};
}
