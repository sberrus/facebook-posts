// imports
import { Request, Response } from "express";
import { isLongLivedTokenValid } from "../helpers/facebookTokens";
import { facebook, firestore } from "../app";
/**
 * Generate a new Long Lived Token and save it into BD
 */
export const generateLongLiveToken = async (req: Request, res: Response) => {
	const firebaseUser = req.firebaseUser;
	const fb_access_token = req.body["x-auth-facebook"];
	// workspace
	let workspace;

	try {
		const fbTokenData = await facebook.getTokenData(fb_access_token);

		// check if firebase user and fb token user are same
		if (fbTokenData.email !== req.firebaseUser?.email) {
			return res.status(403).json({ ok: false, msg: "Firebase user is not the workspace admin" });
		}

		// Generate long lived token
		const LLT = await facebook.generateLongLivedToken(fb_access_token as string);

		// Save LLT in workspace
		if (firebaseUser) {
			workspace = await firestore.saveWorkspaceToken(firebaseUser?.uid, LLT);
		}

		return res.json({ ok: true, msg: "Long lived token generated!" });
	} catch (error: any) {
		console.log(error);
		return res.status(400).json({ ok: false, msg: "Long lived token generation error" });
	}
};

export const checkTokenStatus = async (req: Request, res: Response) => {
	// get user
	const user = req.firebaseUser;
	// workspace Long Lived Token
	let longLivedToken;

	// debug
	if (!user) {
		return res.status(403).json({ ok: false, msg: "user token not found" });
	}

	try {
		// Get user workspace
		if (user) {
			const workspace = await firestore.getUserWorkspace(user.uid);
			if (!workspace) {
				return res.status(404).json({ ok: false, msg: "The token is not valid or not exists!" });
			}

			longLivedToken = workspace.longLivedToken;
		}

		// check if workspace have valid longLivedToken
		const isValidToken = await isLongLivedTokenValid(longLivedToken);

		if (isValidToken) {
			//
			res.json({ ok: true, token_status: true });
		}
	} catch (error: any) {
		console.log("🚀 ~ file: token.controller.ts:33 ~ checkTokenStatus ~ error", error);
		return res.json({ ok: false, msg: "Error trying to fetch the token status", token_status: false });
	}
};
