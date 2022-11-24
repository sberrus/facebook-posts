// imports
import { Router } from "express";
// controller
import { createPost } from "../controllers/facebook.controller";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const facebookRouter = Router();

facebookRouter.post("/posts", [errorHandler], createPost);

export default facebookRouter;
