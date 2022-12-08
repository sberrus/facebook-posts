// imports
import { NextFunction, Request, Response } from "express";
import { auth } from "../app";

export const checkFirebaseUserToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers["x-auth-firebase"] as string;

	const isValid = await auth.checkAuthToken(token);

	if (!isValid) {
		return res.status(403).json({ ok: false, msg: "token provided is not valid" });
	}

	// the token is valid
	next();
};
