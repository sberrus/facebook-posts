// imports
import { Router } from "express";
import { body, query } from "express-validator";
import { generateLongLiveToken } from "../controllers/token.controller";
// middlewares
import { errorHandler } from "../middlewares/express-validator";
import { IsTokenOwner } from "../middlewares/facebook.middleware";

//
const tokenRouter = Router();

tokenRouter.get(
	"/generate-llt",
	[
		query("access_token").notEmpty().withMessage("token must be provided"),
		query("owner").notEmpty().withMessage("owner value must be provided"),
		IsTokenOwner,
		errorHandler,
	],
	generateLongLiveToken
);

export default tokenRouter;
