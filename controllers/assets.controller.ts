import { Request, Response } from "express";
import { bucket } from "../app";

export const uploadAssetsToFirebase = async (req: Request, res: Response) => {
	try {
		// check if file exists
		if (!req.file) {
			return res.status(400).json({ ok: false, msg: "you must send a file" });
		}

		try {
			// save asset into bucket
			await bucket.uploadFile(req);

			return res.json({ ok: true, msg: "file uploaded successfully" });
		} catch (error) {
			console.log("🚀 ~ file: test.controller.ts:13 ~ uploadResourceToFirebase ~ error", error);
			return res.status(400).json({ ok: false, msg: "Error trying to upload the file" });
		}
	} catch (error) {
		console.log("🚀 ~ file: test.controller.ts:14 ~ uploadResourceToFirebase ~ error", error);
		return res.status(500).json({ ok: false, msg: "server error" });
	}
};

export const getAssetsList = async (req: Request, res: Response) => {
	//
	try {
		const files = await bucket.getFilesList();
		res.json({ ok: true, files });
	} catch (error) {
		return res.status(500).json({ ok: false, msg: "Error trying to get files" });
	}
};
