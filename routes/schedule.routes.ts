// imports
import { Router } from "express";
import { body, param } from "express-validator";
// scheduler controller
import { addJob, deleteProgrammedJob, getProgrammedJobs } from "../controllers/schedule.controller";
// custom validators
import {
	// checkIfJobExists,
	//  checkScheduleConfig,
	validateAsset,
} from "../middlewares/jobs.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";

//
const scheduleRouter = Router();

// create a new job and save it into bd
scheduleRouter.post(
	"/",
	[
		body("title").notEmpty(),
		body("page_post.message").notEmpty(),
		body("page_post.page_id").notEmpty(),
		body("page_post.type").notEmpty().custom(validateAsset),
		body("page_post.schedule_config.date").notEmpty().isNumeric(),
		body("page_post.schedule_config.hour").notEmpty().isNumeric(),
		body("page_post.schedule_config.minute").notEmpty().isNumeric(),
		errorHandler,
		checkFirebaseUserToken,
	],
	addJob
);

// get all jobs
scheduleRouter.get("/", getProgrammedJobs);

// get single job data
scheduleRouter.delete("/:id", [param("id").notEmpty(), errorHandler], deleteProgrammedJob);

export default scheduleRouter;
