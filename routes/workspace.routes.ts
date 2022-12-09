// imports
import { Router } from "express";
import { body, header } from "express-validator";
import { getWorkspace } from "../controllers/workspace.controller";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const workspaceRouter = Router();

workspaceRouter.get("/", [checkFirebaseUserToken, errorHandler], getWorkspace);

export default workspaceRouter;
