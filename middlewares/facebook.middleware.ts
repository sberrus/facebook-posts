// imports
import { NextFunction, Request, Response } from "express";
import axios from "axios";

/**
 * checks if token passed is the same as the user in the request request
 */

export const IsTokenOwner = async (req: Request, res: Response, next: NextFunction) => {
	// queries
	const { access_token, owner } = req.query;
	// check if owner is the owner
	try {
		const fbRes = await axios.get(
			`https://graph.facebook.com/v15.0/me?fields=id,name,email&access_token=${access_token}`
		);

		const tokenEmail = fbRes.data.email;
		if (owner !== tokenEmail) {
			return res.json({ ok: false, msg: "credentials providad are not valid" });
		}
		next();
	} catch (error: any) {
		console.log(error.response.data.error.message);
		return res.json({ ok: false, msg: error.response.data.error.message });
	}
};
