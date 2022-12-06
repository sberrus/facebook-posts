// imports
import { Router } from "express";
import processFile from "../middlewares/upload";
import { getResourcesList, uploadResourceToFirebase } from "../controllers/test.controller";

//
const testRouter = Router();

testRouter.post("/", processFile, uploadResourceToFirebase);
testRouter.get("/", processFile, getResourcesList);

export default testRouter;
