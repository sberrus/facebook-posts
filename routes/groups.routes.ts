// imports
import { Router } from "express";
// controllers
import { getWorkspaceGroups } from "../controllers/groups.controller";

//
const groupsRouter = Router();

groupsRouter.get("/", getWorkspaceGroups);

export default groupsRouter;
