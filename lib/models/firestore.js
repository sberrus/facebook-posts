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
// imports
const firestore_1 = require("firebase-admin/firestore");
/**
 * Firestore controller
 */
class FirestoreController {
    //
    constructor() {
        // get firestore instance
        this.db = (0, firestore_1.getFirestore)();
        // get firestore jobs reference
        this.jobsReference = this.db.collection("jobs");
        this.tokensReference = this.db.collection("tokens");
    }
    /**
     *
     * @returns Jobs collections saved in db
     */
    getJobsProgrammed() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield this.jobsReference.where("job_status", "==", "programmed").get();
                return snapshot.docs.map((doc) => doc.data());
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /**
     * Insert new document with job's information
     * @param param0
     * @param param1
     */
    createJob({ id }, { title = "", message = "", type = "text", url = "", emotion = "", asset_src = "", location = "", schedule_config, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.jobsReference.add({
                    id,
                    title,
                    message,
                    type,
                    url,
                    emotion,
                    asset_src,
                    location,
                    schedule_config,
                    job_status: "programmed",
                });
            }
            catch (error) {
                console.log(error);
                throw new Error("Error when adding doc to firestore");
            }
        });
    }
    /**
     * Change the job's status in firestore document
     * @param id firestore's job id. Don't confuse with firestore auto-generated document id. It's the id property
     * given by the system.
     * @param status new status for the job. EJ: "programmed" | "draft" | "trash".
     */
    changeJobStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // find single job
                const job = yield this.jobsReference.where("id", "==", id).get();
                // check if job exists
                if (job.empty) {
                    return;
                }
                const foundJobRef = job.docs[0].ref;
                yield foundJobRef.update({ job_status: status });
            }
            catch (error) {
                throw new Error("Error in server");
            }
        });
    }
    /**
     * Save long live token into workspace collection
     */
    saveLongLivedToken(owner, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tokensReference.doc(owner).set({ LLT: token });
        });
    }
}
//
exports.default = FirestoreController;
//# sourceMappingURL=firestore.js.map