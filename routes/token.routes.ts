// imports
import { Router } from "express";
import { body, header } from "express-validator";
import { checkTokenStatus, generateLongLiveToken } from "../controllers/token.controller";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const tokenRouter = Router();

tokenRouter.post(
	"/generate-llt",
	[
		body("x-auth-facebook").notEmpty().withMessage("facebook token must be provided"),
		header("x-auth-firebase").notEmpty(),
		checkFirebaseUserToken,
		errorHandler,
	],
	generateLongLiveToken
);

tokenRouter.get(
	"/token-status",
	[header("x-auth-firebase").notEmpty(), errorHandler, checkFirebaseUserToken],
	checkTokenStatus
);

export default tokenRouter;
