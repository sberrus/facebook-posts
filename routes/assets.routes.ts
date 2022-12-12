// imports
import { Router } from "express";
import { header } from "express-validator";
import { errorHandler } from "../middlewares/express-validator";
// middlewares
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
import processFileMiddleware from "../middlewares/upload";
// controller
import { getAssetsList, uploadAssetsToFirebase } from "../controllers/assets.controller";

//
const testRouter = Router();

testRouter.get("/", [checkFirebaseUserToken], getAssetsList);
testRouter.post(
	"/upload",
	[header("x-auth-firebase"), errorHandler, processFileMiddleware, checkFirebaseUserToken],
	uploadAssetsToFirebase
);

export default testRouter;
