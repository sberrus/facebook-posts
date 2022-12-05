"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const express_validator_1 = require("express-validator");
const errorHandler = (req, res, next) => {
    const results = (0, express_validator_1.validationResult)(req);
    if (!results.isEmpty()) {
        return res.status(400).json(results.array());
    }
    next();
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=express-validator.js.map