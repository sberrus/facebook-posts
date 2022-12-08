// imports
import { Request, Response } from "express";
import { getLongLivedToken, isLongLivedTokenValid } from "../helpers/facebookTokens";
import { firestore } from "../app";
/**
 * Generate a new Long Lived Token and save it into BD
 */
export const generateLongLiveToken = async (req: Request, res: Response) => {
	const { access_token, owner } = req.query;
	try {
		// generate long lived token
		const LLT = await getLongLivedToken(access_token as string);

		// save long live token into firebase
		firestore.saveLongLivedToken(owner as string, LLT);
		//
		return res.json({ ok: true, msg: "Long lived token generated!" });
	} catch (error: any) {
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
		return res.json({ ok: false, msg: "Error trying to fetch the token status" });
	}
};
