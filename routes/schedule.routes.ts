// imports
import { Router } from "express";
import { body, query } from "express-validator";
// scheduler controller
import { addJob, getWorkspaceJobs } from "../controllers/schedule.controller";
// custom validators
import { validateAsset } from "../middlewares/jobs.middleware";
// middlewares
import { errorHandler } from "../middlewares/express-validator";

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
	],
	addJob
);

// get workspace jobs
scheduleRouter.get("/", [query("current_page").optional().isNumeric(), errorHandler], getWorkspaceJobs);

export default scheduleRouter;
