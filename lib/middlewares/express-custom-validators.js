"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfJobExists = exports.checkScheduleConfig = exports.isValidType = void 0;
const app_1 = require("../app");
const isValidType = (value) => {
    const validTypes = ["text", "img", "video"];
    if (!validTypes.includes(value)) {
        throw new Error(`type ${value} is not valid`);
    }
    return true;
};
exports.isValidType = isValidType;
const checkScheduleConfig = ({ day, time }) => {
    if (day > 6) {
        throw new Error("day field should be a number 0-6");
    }
    if (time === null || time === void 0 ? void 0 : time.hour) {
        if (time.hour > 23) {
            throw new Error("time.hour data should be a number between 0-23");
        }
    }
    if (time === null || time === void 0 ? void 0 : time.minute) {
        if (time.minute > 59) {
            throw new Error("time.minute data should be a number between 0-59");
        }
    }
    return true;
};
exports.checkScheduleConfig = checkScheduleConfig;
const checkIfJobExists = (value) => {
    const jobFound = app_1.scheduler.jobExists(value);
    if (!jobFound) {
        throw new Error(`Job with id ${value} does not exists`);
    }
    return true;
};
exports.checkIfJobExists = checkIfJobExists;
//# sourceMappingURL=express-custom-validators.js.map