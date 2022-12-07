// imports
import { Router } from "express";
import processFile from "../middlewares/upload";
import { getAssetsList, uploadAssetsToFirebase } from "../controllers/assets.controller";

//
const testRouter = Router();

testRouter.post("/", processFile, uploadAssetsToFirebase);
testRouter.get("/", processFile, getAssetsList);

export default testRouter;
