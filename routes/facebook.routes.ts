// imports
import { Router } from "express";
import { body } from "express-validator";
// scheduler controller
import { addJob, getProgramedJobs } from "../controllers/facebook.controller";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const facebookRouter = Router();

// create a new job and save it into bd
facebookRouter.post(
	"/schedule-post",
	[body("message").notEmpty().withMessage("Message must be provided"), body("type").notEmpty(), errorHandler],
	addJob
);
// get all jobs
facebookRouter.get("/schedule-post", getProgramedJobs);

export default facebookRouter;
