// imports
import { Router } from "express";
import { body } from "express-validator";
import {
	addPageToWorkspace,
	deleteWorkspacePage,
	getAdminPages,
	getWorkspace,
	createNewWorkspaceAndUser,
} from "../controllers/workspace.controller";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const workspaceRouter = Router();

// workspace
workspaceRouter.get("/", errorHandler, getWorkspace);
// create new worspace
workspaceRouter.post("/", errorHandler, createNewWorkspaceAndUser);
// pages
workspaceRouter.get("/pages", errorHandler, getAdminPages);
workspaceRouter.post("/page", [body("page_id").exists(), errorHandler], addPageToWorkspace);
workspaceRouter.delete("/page", [body("page_id").exists(), errorHandler], deleteWorkspacePage);

export default workspaceRouter;
