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
exports.createNewPagePost = void 0;
// import
const app_1 = require("../app");
const axios_1 = __importDefault(require("axios"));
const createNewPagePost = (facebookPostBody) => __awaiter(void 0, void 0, void 0, function* () {
    // Long lived token
    let LLT;
    // Get facebook sharing groups id's
    const sharingGroupsIds = facebookPostBody.sharing_groups_ids;
    // Get facebook page id
    const pageId = facebookPostBody.page_id;
    // Get new post permalink url
    let postPermalink;
    // Get facebook page token
    let pageToken;
    // Get Long lived token
    try {
        LLT = yield app_1.firestore.getLongLivedToken(facebookPostBody.owner);
    }
    catch (error) {
        console.log("🚀 ~ file: facebookPosts.ts:12 ~ createNewPagePost ~ error", error);
        throw error;
    }
    // Get facebook page token
    try {
        const axPageResponse = yield axios_1.default.get(`https://graph.facebook.com/v15.0/me/accounts?fields=id,access_token&access_token=${LLT}`);
        const { data } = axPageResponse.data;
        const page = data.find((page) => page.id === pageId);
        pageToken = page.access_token;
    }
    catch (error) {
        console.log("🚀 ~ file: facebookPosts.ts:13 ~ createNewPagePost ~ error", error.response.data);
        throw error.response.data;
    }
    /** TEXT CASE */
    if (facebookPostBody.type === "text") {
        const message = facebookPostBody.message;
        // Create Facebook page post
        try {
            const fbPostRes = yield axios_1.default.post(`https://graph.facebook.com/v15.0/${pageId}/feed?message=${message}&fields=permalink_url&access_token=${pageToken}`);
            const postData = fbPostRes.data;
            // save post permalink_url
            postPermalink = postData.permalink_url;
        }
        catch (error) {
            console.log("🚀 ~ file: facebookPosts.ts:43 ~ createNewPagePost ~ error", error);
            throw error.response.data;
        }
        // Share page post in groups
        sharingGroupsIds.map((gruop_id) => __awaiter(void 0, void 0, void 0, function* () {
            yield axios_1.default.post(`https://graph.facebook.com/v15.0/${gruop_id}/feed?link=${postPermalink}&access_token=${LLT}`);
        }));
    }
    /** IMAGE CASE */
});
exports.createNewPagePost = createNewPagePost;
//# sourceMappingURL=facebookPosts.js.map