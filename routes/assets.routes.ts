// imports
import { Router } from "express";
import { header } from "express-validator";
import { errorHandler } from "../middlewares/express-validator";
// middlewares
import processFileMiddleware from "../middlewares/upload";
// controller
import { getAssetsList, uploadAssetsToFirebase } from "../controllers/assets.controller";

//
const assetsRouter = Router();

assetsRouter.get("/", getAssetsList);
assetsRouter.post("/upload", [header("x-auth-firebase"), errorHandler, processFileMiddleware], uploadAssetsToFirebase);

export default assetsRouter;
