import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { FileSaveError } from "./errors";
import { File } from "node:buffer";

export interface FileSaveParams {
	buffer: Buffer;
	originalName: string;
	allowedExtensions: string[];
	targetFolder: string;
	maxBufferLength?: number;
}

export function saveFileFromBuffer({
	buffer,
	originalName,
	allowedExtensions,
	targetFolder,
	maxBufferLength = 10_485_760, // 10 MB
}: FileSaveParams): string {
	// Check buffer length
	if (buffer.byteLength > maxBufferLength) {
		throw new FileSaveError("too large file");
	}

	// Check extension
	const originalExt = path.extname(originalName).toLowerCase().slice(1);
	if (!allowedExtensions.includes(originalExt)) {
		throw new FileSaveError("File type not allowed");
	}

	// Create uuid file name
	const fileName = `${uuidv4()}.${originalExt}`;
	// Get root dir of nodejs process
	const rootDir = process.cwd();
	// Define upload dir of file
	const uploadDir = path.resolve(rootDir, targetFolder);
	// Create necessary folders if it needs
	if (!existsSync(uploadDir)) {
		mkdirSync(uploadDir);
	}
	// Define full path to file
	const fullPath = path.resolve(uploadDir, fileName);

	try {
		// Save file
		writeFileSync(fullPath, buffer);
		return fileName;
	} catch (err) {
		console.error("could save image from buffer ", err);
		throw new FileSaveError("unable to save file from buffer");
	}
}

export function saveBufferToFile(
	buffer: Buffer,
	targetFolder: string,
	ext: string,
	maxBufferLength: number = 10_485_760
) {
	// Check buffer length
	if (buffer.length > maxBufferLength) {
		throw new FileSaveError("too large file");
	}

	// Create uuid file name
	const fileName = `${uuidv4()}.${ext}`;
	// Get root dir of nodejs process
	const rootDir = process.cwd();
	// Define upload dir of file
	const uploadDir = path.resolve(rootDir, targetFolder);
	// Create necessary folders if it needs
	if (!existsSync(uploadDir)) {
		mkdirSync(uploadDir);
	}
	// Define full path to file
	const fullPath = path.resolve(uploadDir, fileName);

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