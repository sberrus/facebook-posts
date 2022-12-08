// imports
import { Router } from "express";
import { body, header, query } from "express-validator";
import { checkTokenStatus, generateLongLiveToken } from "../controllers/token.controller";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
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
		errorHandler,
		IsTokenOwner,
	],
	generateLongLiveToken
);

tokenRouter.get(
	"/token-status",
	[header("x-auth-firebase").notEmpty(), errorHandler, checkFirebaseUserToken],
	checkTokenStatus
);

export default tokenRouter;
