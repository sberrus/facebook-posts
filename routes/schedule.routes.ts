// imports
import { Router } from "express";
import { body, param } from "express-validator";
// scheduler controller
import { addJob, deleteProgrammedJob, getProgrammedJobs } from "../controllers/schedule.controller";
// custom validators
import { checkIfJobExists, checkScheduleConfig, isValidType } from "../middlewares/jobs.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

//
const scheduleRouter = Router();

// create a new job and save it into bd
scheduleRouter.post(
	"/schedule-post",
	[
		body("owner").notEmpty(),
		body("title").notEmpty(),
		body("message").notEmpty().withMessage("Message must be provided"),
		body("type").custom(isValidType),
		body("schedule_config").custom(checkScheduleConfig),
		errorHandler,
	],
	addJob
);
// get all jobs
scheduleRouter.get("/schedule-post/", getProgrammedJobs);

scheduleRouter.delete("/schedule-post/:id", [param("id").custom(checkIfJobExists), errorHandler], deleteProgrammedJob);

export default scheduleRouter;
