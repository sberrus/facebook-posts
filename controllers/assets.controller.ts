import { Request, Response } from "express";
import { bucket, firestore } from "../app";

export const uploadAssetsToFirebase = async (req: Request, res: Response) => {
	// user
	const user = req.firebaseUser;
	// workspace
	let workspaceID: string = "";

	// get user workspace
	if (user) {
		try {
			const userWorkspace = await firestore.getUserWorkspaceReference(user.uid);
			if (userWorkspace) {
				workspaceID = userWorkspace.id;
			} else {
				return res.status(500).json({ ok: false, msg: "Error trying to fetch user's workspace" });
			}
		} catch (error) {
			console.log("🚀 ~ file: assets.controller.ts:20 ~ uploadAssetsToFirebase ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to fetch user's workspace" });
		}
	}

	// check if file exists
	if (!req.file) {
		console.log("🚀 ~ file: assets.controller.ts:27 ~ uploadAssetsToFirebase ~ file", "File not found");
		return res.status(400).json({ ok: false, msg: "you must send a file" });
	}

	// check if workspace exists
	if (workspaceID) {
		try {
			// save asset into bucket
			await bucket.uploadFile(req, workspaceID);

			return res.json({ ok: true, msg: "file uploaded successfully" });
		} catch (error) {
			console.log("🚀 ~ file: assets.controller.ts:50 ~ uploadAssetsToFirebase ~ error", error);
			return res.status(400).json({ ok: false, msg: "Error trying to upload the file" });
		}
	}
};

export const getAssetsList = async (req: Request, res: Response) => {
	//get user
	const user = req.firebaseUser;
	// workspace
	let workspaceID;

	// get workspace
	if (user) {
		try {
			const userWorkspace = await firestore.getUserWorkspaceReference(user?.uid);
			if (userWorkspace) {
				workspaceID = userWorkspace.id;
			}
		} catch (error) {
			console.log("🚀 ~ file: assets.controller.ts:56 ~ getAssetsList ~ error", error);
			return res.status(400).json({ ok: false, msg: "Error fetching user workspace" });
		}
	}

	// return workspace files
	if (workspaceID) {
		try {
			const files = await bucket.getWorkspaceFiles(workspaceID);
			return res.json({ ok: true, files });
		} catch (error) {
			console.log("🚀 ~ file: assets.controller.ts:63 ~ getAssetsList ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to get files" });
		}
	}
};
