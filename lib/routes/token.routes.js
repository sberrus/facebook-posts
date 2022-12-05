"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const token_controller_1 = require("../controllers/token.controller");
// middlewares
const express_validator_2 = require("../middlewares/express-validator");
const facebook_middleware_1 = require("../middlewares/facebook.middleware");
//
const tokenRouter = (0, express_1.Router)();
tokenRouter.get("/generate-llt", [
    (0, express_validator_1.query)("access_token").notEmpty().withMessage("token must be provided"),
    (0, express_validator_1.query)("owner").notEmpty().withMessage("owner value must be provided"),
    facebook_middleware_1.IsTokenOwner,
    express_validator_2.errorHandler,
], token_controller_1.generateLongLiveToken);
exports.default = tokenRouter;
//# sourceMappingURL=token.routes.js.map