import { Request, Response } from "express";
import { firestore } from "../app";

export const getWorkspace = async (req: Request, res: Response) => {
	// firebase user
	const user = req.firebaseUser;
	// workspace
	let workspace;
	// Get workspace
	if (user) {
		workspace = await firestore.getUserWorkspace(user?.uid);
	}

	// Hide workspace Long Lived Token
	if (workspace) {
		delete workspace.longLivedToken;
	}

	res.json({ ok: true, workspace });
};
