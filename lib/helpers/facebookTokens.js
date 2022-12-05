"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLongLivedToken = void 0;
const axios_1 = __importDefault(require("axios"));
// constants
const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;
/**
 * Generate a new Facebook Long Lived Access Token
 * @param access_token facebook oauth access_token
 */
const getLongLivedToken = (access_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fbRes = yield axios_1.default.get(`https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${access_token}`);
        return fbRes.data.access_token;
    }
    catch (error) {
        throw error;
    }
});
exports.getLongLivedToken = getLongLivedToken;
//# sourceMappingURL=facebookTokens.js.map