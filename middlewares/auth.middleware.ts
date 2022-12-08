// imports
import { NextFunction, Request, Response } from "express";
import { auth } from "../app";

export const checkFirebaseUserToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers["x-auth-firebase"] as string;

	try {
		const user = await auth.checkAuthToken(token);
		// add user property to request
		req.firebaseUser = user;

		if (!user) {
			return res.status(403).json({ ok: false, msg: "token provided is not valid" });
		}
	} catch (error) {
		console.log("🚀 ~ file: auth.middleware.ts:17 ~ checkFirebaseUserToken ~ error", error);
	}

	// the token is valid
	next();
};
