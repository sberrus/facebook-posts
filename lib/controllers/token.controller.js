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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLongLiveToken = void 0;
const facebookTokens_1 = require("../helpers/facebookTokens");
const app_1 = require("../app");
/**
 * Generate a new Long Lived Token and save it into BD
 */
const generateLongLiveToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { access_token, owner } = req.query;
    try {
        // generate long lived token
        const LLT = yield (0, facebookTokens_1.getLongLivedToken)(access_token);
        // save long live token into firebase
        app_1.firestore.saveLongLivedToken(owner, LLT);
        //
        return res.json({ ok: true, msg: "Long lived token generated!" });
    }
    catch (error) {
        return res.status(400).json({ ok: false, msg: "Long lived token generation error" });
    }
});
exports.generateLongLiveToken = generateLongLiveToken;
//# sourceMappingURL=token.controller.js.map