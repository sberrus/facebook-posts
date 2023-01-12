import { Request, Response } from "express";
import { firestore, sockets } from "../app";

export const test = async (req: Request, res: Response) => {
	// user token data
	const user = req.firebaseUser;
	// message
	const message = req.query.message as string;
	try {
		if (user) {
			// get workspace
			const workspace = await firestore.getUserWorkspaceReference(user.uid);

			if (workspace && message) {
				sockets.testMessage(workspace.id, message);
			}
		}
	} catch (error) {}
	//
	res.json({ ok: true });
};
