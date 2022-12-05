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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const app_1 = require("firebase-admin/app");
dotenv.config();
// secrets
const GCLOUD_PROJECET_ID = process.env.GCLOUD_PROJECET_ID;
const GCLOUD_CLIENT_EMAIL = process.env.GCLOUD_CLIENT_EMAIL;
const GCLOUD_PRIVATE_KEY = process.env.GCLOUD_PRIVATE_KEY;
class FirebaseApp {
    constructor() {
        this.app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId: GCLOUD_PROJECET_ID,
                clientEmail: GCLOUD_CLIENT_EMAIL,
                privateKey: GCLOUD_PRIVATE_KEY,
            }),
            storageBucket: "facebook-automate-1526f.appspot.com/",
        });
    }
    getApp() {
        return this.app;
    }
}
exports.default = FirebaseApp;
//# sourceMappingURL=firebase.js.map