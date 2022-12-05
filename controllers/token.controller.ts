// imports
import { Request, Response } from "express";
import { getLongLivedToken } from "../helpers/facebookTokens";
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
