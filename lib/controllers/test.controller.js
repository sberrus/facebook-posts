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
exports.getResourcesList = exports.uploadResourceToFirebase = void 0;
const app_1 = require("../app");
const uploadResourceToFirebase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ ok: false, msg: "you must send a file" });
        }
        // save asset into bucket
        try {
            yield app_1.bucket.uploadFile(req);
            return res.json({ ok: true, msg: "file uploaded successfully" });
        }
        catch (error) {
            console.log("🚀 ~ file: test.controller.ts:13 ~ uploadResourceToFirebase ~ error", error);
            return res.status(400).json({ ok: false, msg: "Error trying to upload the file" });
        }
    }
    catch (error) {
        console.log("🚀 ~ file: test.controller.ts:14 ~ uploadResourceToFirebase ~ error", error);
        return res.status(500).json({ ok: false, msg: "server error" });
    }
});
exports.uploadResourceToFirebase = uploadResourceToFirebase;
const getResourcesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
    try {
        const files = yield app_1.bucket.getFilesList();
        res.json({ ok: true, files });
    }
    catch (error) {
        return res.status(500).json({ ok: false, msg: "Error trying to get files" });
    }
});
exports.getResourcesList = getResourcesList;
//# sourceMappingURL=test.controller.js.map