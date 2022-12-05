"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduler = exports.firestore = exports.bucket = exports.app = void 0;
// imports
const dotenv = __importStar(require("dotenv"));
const bucket_1 = __importDefault(require("./models/bucket"));
const firebase_1 = __importDefault(require("./models/firebase"));
dotenv.config();
const firestore_1 = __importDefault(require("./models/firestore"));
const scheduler_1 = __importDefault(require("./models/scheduler"));
const server_1 = __importDefault(require("./models/server"));
// server
const server = new server_1.default();
server.listen();
// initialize Firebase app
const firebaseApp = new firebase_1.default();
exports.app = firebaseApp.getApp();
// init bucket
exports.bucket = new bucket_1.default();
// init firestore
exports.firestore = new firestore_1.default();
// scheduler app
exports.scheduler = new scheduler_1.default();
//# sourceMappingURL=app.js.map