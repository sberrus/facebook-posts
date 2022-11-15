// imports
import { Router } from "express";
// controllers
import { ping } from "../controllers/ping.controller";

const pingRouter = Router();

pingRouter.get("/", ping);

export default pingRouter;
