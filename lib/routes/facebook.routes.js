"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = require("express");
const express_validator_1 = require("express-validator");
// scheduler controller
const facebook_controller_1 = require("../controllers/facebook.controller");
// custom validators
const express_custom_validators_1 = require("../middlewares/express-custom-validators");
// middlewares
const express_validator_2 = require("../middlewares/express-validator");
//
const facebookRouter = (0, express_1.Router)();
// create a new job and save it into bd
facebookRouter.post("/schedule-post", [
    (0, express_validator_1.body)("title").notEmpty(),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message must be provided"),
    (0, express_validator_1.body)("type").custom(express_custom_validators_1.isValidType),
    (0, express_validator_1.body)("schedule_config").custom(express_custom_validators_1.checkScheduleConfig),
    express_validator_2.errorHandler,
], facebook_controller_1.addJob);
// get all jobs
facebookRouter.get("/schedule-post/", facebook_controller_1.getProgrammedJobs);
facebookRouter.delete("/schedule-post/:id", [(0, express_validator_1.param)("id").custom(express_custom_validators_1.checkIfJobExists), express_validator_2.errorHandler], facebook_controller_1.deleteProgrammedJob);
exports.default = facebookRouter;
//# sourceMappingURL=facebook.routes.js.map