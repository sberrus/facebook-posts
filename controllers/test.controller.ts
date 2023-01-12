import { Request, Response } from "express";
import { facebook, firestore } from "../app";

export const test = async (req: Request, res: Response) => {
	// user token data
	const user = req.firebaseUser;
	// message
	try {
		if (user) {
			// get workspace
			const workspace = await firestore.getUserWorkspaceReference(user.uid);
			if (workspace) {
				facebook.shareLastPostInExternalGroups("fHN7SQuDGkBDF26zqaiY");
			}
		}
	} catch (error) {
		console.log(error);
	}
	//
	res.json({ ok: true });
};
