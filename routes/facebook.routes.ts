// imports
import { Router } from "express";
import { body, param } from "express-validator";
// scheduler controller
import { addJob, deleteProgrammedJob, getProgrammedJobs } from "../controllers/facebook.controller";
// custom validators
import { checkIfJobExists, checkScheduleConfig, isValidType } from "../middlewares/express-custom-validators";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const facebookRouter = Router();

// create a new job and save it into bd
facebookRouter.post(
	"/schedule-post",
	[
		body("title").notEmpty(),
		body("message").notEmpty().withMessage("Message must be provided"),
		body("type").custom(isValidType),
		body("schedule_config").custom(checkScheduleConfig),
		errorHandler,
	],
	addJob
);
// get all jobs
facebookRouter.get("/schedule-post/", getProgrammedJobs);

facebookRouter.delete("/schedule-post/:id", [param("id").custom(checkIfJobExists), errorHandler], deleteProgrammedJob);

export default facebookRouter;
