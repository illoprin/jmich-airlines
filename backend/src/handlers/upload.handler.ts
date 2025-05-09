import { Request, Response } from "express";
import { saveFileFromBuffer } from "@/lib/service/save-file";
import { ResponseTypes } from "@/lib/api/response";
import { FileSaveError } from "@/lib/service/errors";
import { HTTPHandlerFunc } from "@/types/internal/middleware";

export class UploadHandler {
	static handleUpload(path: string, resolveUrl: string): HTTPHandlerFunc {
		return (req: Request, res: Response): void => {
			if (!req.files || Object.keys(req.files).length === 0) {
				res.status(400).json(ResponseTypes.error("no files uploaded"));
				return;
			}

			try {
				const file: any = Object.values(req.files)[0];
				const fileName = saveFileFromBuffer({
					buffer: file.data,
					originalName: file.name,
					targetFolder: path,
					allowedExtensions: ["png", "jpg", "jpeg", "pdf", "webp"],
				});
				res.status(200).json(ResponseTypes.ok({ filename: `${resolveUrl}/${fileName}` }));
			} catch (error) {
				if (error instanceof FileSaveError) {
					res.status(400).json(ResponseTypes.error(error.message));
					return;
				}
				console.error("Upload error:", error);
				res.status(500).json(ResponseTypes.internalError());
			}
		};
	}
}
