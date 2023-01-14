import { Request, Response } from "express";
import { sleep } from "../helpers/util";

export const test = async (req: Request, res: Response) => {
	// user token data
	// const user = req.firebaseUser;
	// message
	// try {
	// 	if (user) {
	// 		// get workspace
	// 		const workspace = await firestore.getUserWorkspaceReference(user.uid);
	// 		if (workspace) {
	// 			facebook.shareLastPostInExternalGroups("fHN7SQuDGkBDF26zqaiY");
	// 		}
	// 	}
	// } catch (error) {
	// 	console.log(error);
	// }
	//
	let count = 1;
	while (count <= 3) {
		await sleep(3);
		console.log(`count ${count}`);
		count++;
	}

	res.json({ ok: true });
};
