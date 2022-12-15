// imports
import { Router } from "express";
// controllers
import { getWorkspaceGroups } from "../controllers/groups.controller";
// middlewares
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";

//
const groupsRouter = Router();

groupsRouter.get("/", checkFirebaseUserToken, getWorkspaceGroups);

export default groupsRouter;
