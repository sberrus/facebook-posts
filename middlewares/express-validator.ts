import { NextFunction, Request, Response } from "express";

import { validationResult } from "express-validator";

export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
	const results = validationResult(req);
	if (!results.isEmpty()) {
		return res.status(400).json(results.array());
	}
	next();
};
