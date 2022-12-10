// imports
import { Router } from "express";
import { body, header } from "express-validator";
import {
	addPageToWorkspace,
	deleteWorkspacePage,
	getAdminPages,
	getWorkspace,
} from "../controllers/workspace.controller";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const workspaceRouter = Router();

workspaceRouter.get("/", [checkFirebaseUserToken, errorHandler], getWorkspace);
workspaceRouter.get("/pages", [checkFirebaseUserToken, errorHandler], getAdminPages);
workspaceRouter.post("/page", [body("page_id").exists(), checkFirebaseUserToken, errorHandler], addPageToWorkspace);
workspaceRouter.delete("/page", [body("page_id").exists(), checkFirebaseUserToken, errorHandler], deleteWorkspacePage);

export default workspaceRouter;
