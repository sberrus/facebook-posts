"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const express_1 = require("express");
const upload_1 = __importDefault(require("../middlewares/upload"));
const test_controller_1 = require("../controllers/test.controller");
//
const testRouter = (0, express_1.Router)();
testRouter.post("/", upload_1.default, test_controller_1.uploadResourceToFirebase);
testRouter.get("/", upload_1.default, test_controller_1.getResourcesList);
exports.default = testRouter;
//# sourceMappingURL=test.routes.js.map