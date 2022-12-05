"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// scheduler controller
const schedule_controller_1 = require("../controllers/schedule.controller");
// custom validators
const jobs_middleware_1 = require("../middlewares/jobs.middleware");
// middlewares
const express_validator_2 = require("../middlewares/express-validator");
//
const scheduleRouter = (0, express_1.Router)();
// create a new job and save it into bd
scheduleRouter.post("/schedule-post", [
    (0, express_validator_1.body)("owner").notEmpty(),
    (0, express_validator_1.body)("page_id").notEmpty(),
    (0, express_validator_1.body)("sharing_groups_ids").notEmpty(),
    (0, express_validator_1.body)("title").notEmpty(),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message must be provided"),
    (0, express_validator_1.body)("type").custom(jobs_middleware_1.isValidType),
    (0, express_validator_1.body)("schedule_config").custom(jobs_middleware_1.checkScheduleConfig),
    express_validator_2.errorHandler,
], schedule_controller_1.addJob);
// get all jobs
scheduleRouter.get("/schedule-post/", schedule_controller_1.getProgrammedJobs);
scheduleRouter.delete("/schedule-post/:id", [(0, express_validator_1.param)("id").custom(jobs_middleware_1.checkIfJobExists), express_validator_2.errorHandler], schedule_controller_1.deleteProgrammedJob);
exports.default = scheduleRouter;
//# sourceMappingURL=schedule.routes.js.map