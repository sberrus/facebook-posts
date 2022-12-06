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
const util_1 = require("util");
const storage_1 = require("firebase-admin/storage");
/**
 * Bucket controller to get assets from server
 */
class BucketController {
    constructor() {
        // initialize bucket
        this.bucket = (0, storage_1.getStorage)().bucket();
    }
    /**
     * Upload file to firestore
     */
    uploadFile(req) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Create a new blob in the bucket and upload the file data.
                const blob = this.bucket.file(`images/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`);
                const blobStream = blob.createWriteStream({
                    resumable: false,
                });
                blobStream.on("error", (err) => {
                    throw err.message;
                });
                blobStream.on("finish", () => __awaiter(this, void 0, void 0, function* () {
                    var _d, _e;
                    // Create URL for directly file access via HTTP.
                    const publicUrl = (0, util_1.format)(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);
                    try {
                        // Make the file public
                        yield this.bucket.file(`images/${(_d = req.file) === null || _d === void 0 ? void 0 : _d.originalname}`).makePublic();
                    }
                    catch (err) {
                        throw {
                            message: `Uploaded the file successfully: ${(_e = req.file) === null || _e === void 0 ? void 0 : _e.originalname}, but public access is denied!`,
                            url: publicUrl,
                        };
                    }
                }));
                blobStream.end((_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer);
            }
            catch (err) {
                throw {
                    message: `Could not upload the file: ${(_c = req.file) === null || _c === void 0 ? void 0 : _c.originalname}. ${err}`,
                };
            }
        });
    }
    /**
     * Get a list of all files
     */
    getFilesList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [files] = yield this.bucket.getFiles();
                return files.map((file) => {
                    return {
                        name: file.name,
                        url: file.metadata.mediaLink,
                    };
                });
            }
            catch (err) {
                console.log("🚀 ~ file: bucket.ts:69 ~ BucketController ~ getFilesList ~ err", err);
                throw err;
            }
        });
    }
}
exports.default = BucketController;
//# sourceMappingURL=bucket.js.map