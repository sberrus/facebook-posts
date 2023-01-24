// imports
import { Router } from "express";
import { machineInfo, test } from "../controllers/test.controller";

//
const testRouter = Router();

testRouter.get("/", test);
testRouter.get("/date", machineInfo);

export default testRouter;
