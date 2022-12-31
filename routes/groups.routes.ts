// imports
import { Router } from "express";
import { query } from "express-validator";
import { errorHandler } from "../middlewares/express-validator";
// controllers
import { checkExternalGroups, getWorkspaceGroups } from "../controllers/groups.controller";

//
const groupsRouter = Router();

groupsRouter.get("/", getWorkspaceGroups);

// check if external group is valid
groupsRouter.get("/external", [query("url").notEmpty().exists(), errorHandler], checkExternalGroups);

export default groupsRouter;
