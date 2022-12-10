// imports
import { Router } from "express";
import { body, header } from "express-validator";
import { addPageToWorkspace, getAdminPages, getWorkspace } from "../controllers/workspace.controller";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const workspaceRouter = Router();

workspaceRouter.get("/", [checkFirebaseUserToken, errorHandler], getWorkspace);
workspaceRouter.get("/admin-pages", [checkFirebaseUserToken, errorHandler], getAdminPages);
workspaceRouter.post("/add-page", [body("page_id").exists(), checkFirebaseUserToken, errorHandler], addPageToWorkspace);

export default workspaceRouter;
