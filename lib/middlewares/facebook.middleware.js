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
exports.IsTokenOwner = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * checks if token passed is the same as the user in the request request
 */
const IsTokenOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // queries
    const { access_token, owner } = req.query;
    // check if owner is the owner
    try {
        const fbRes = yield axios_1.default.get(`https://graph.facebook.com/v15.0/me?fields=id,name,email&access_token=${access_token}`);
        const tokenEmail = fbRes.data.email;
        if (owner !== tokenEmail) {
            return res.json({ ok: false, msg: "credentials providad are not valid" });
        }
        next();
    }
    catch (error) {
        console.log(error.response.data.error.message);
        return res.json({ ok: false, msg: error.response.data.error.message });
    }
});
exports.IsTokenOwner = IsTokenOwner;
//# sourceMappingURL=facebook.middleware.js.map