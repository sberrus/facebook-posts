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
exports.deleteProgrammedJob = exports.getProgrammedJobs = exports.addJob = void 0;
// import { createPagePost, getPageAccessToken } from "../helpers/facebookPosts";
// scheduler app
const app_1 = require("../app");
/**
 *	create a new job and save it into firestore bd.
 */
const addJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // req body
    const body = req.body;
    try {
        // create a new job
        const jobData = yield app_1.scheduler.addJob(body);
        // save job in firestore
        yield app_1.firestore.createJob(jobData, body);
        return res.json({ ok: true, msg: `job ${jobData.id} succesfully created` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: "Server error" });
    }
});
exports.addJob = addJob;
const getProgrammedJobs = (req, res) => {
    const jobs = app_1.scheduler.getJobs();
    //
    return res.json({ ok: true, jobs });
};
exports.getProgrammedJobs = getProgrammedJobs;
const deleteProgrammedJob = (req, res) => {
    //get job id
    const id = req.params.id;
    app_1.scheduler.cancellJob(id);
    // change status in firestore
    app_1.firestore.changeJobStatus(id, "trash");
    //
    return res.json({ ok: true, msg: `job ${id} deleted succesfully` });
};
exports.deleteProgrammedJob = deleteProgrammedJob;
//# sourceMappingURL=schedule.controller.js.map