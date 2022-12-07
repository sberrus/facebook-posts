// imports
import { Router } from "express";
import processFile, { checkIfWorkspaceExists } from "../middlewares/upload";
import { getAssetsList, uploadAssetsToFirebase } from "../controllers/assets.controller";
import { query } from "express-validator";
import { errorHandler } from "../middlewares/express-validator";

//
const testRouter = Router();

testRouter.post(
	"/",
	[query("workspace").notEmpty().custom(checkIfWorkspaceExists), processFile, errorHandler],
	uploadAssetsToFirebase
);
testRouter.get("/", processFile, getAssetsList);

export default testRouter;
