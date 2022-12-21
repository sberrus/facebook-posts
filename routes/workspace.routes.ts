// imports
import { Router } from "express";
import { body, header } from "express-validator";
import { getWorkspaceJobs } from "../controllers/schedule.controller";
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

// workspace
workspaceRouter.get("/", [checkFirebaseUserToken, errorHandler], getWorkspace);
// pages
workspaceRouter.get("/pages", [checkFirebaseUserToken, errorHandler], getAdminPages);
workspaceRouter.post("/page", [body("page_id").exists(), checkFirebaseUserToken, errorHandler], addPageToWorkspace);
workspaceRouter.delete("/page", [body("page_id").exists(), checkFirebaseUserToken, errorHandler], deleteWorkspacePage);
// jobs
workspaceRouter.get("/jobs", [checkFirebaseUserToken], getWorkspaceJobs);

export default workspaceRouter;
