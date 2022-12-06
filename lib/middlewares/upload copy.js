"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const multer_1 = __importDefault(require("multer"));
const maxSize = 15 * 1024 * 1024;
const processFile = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: maxSize },
}).single("file");
const processFileMiddleware = util_1.default.promisify(processFile);
exports.default = processFileMiddleware;
//# sourceMappingURL=upload%20copy.js.map