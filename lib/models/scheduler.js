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
// imports
const node_schedule_1 = __importDefault(require("node-schedule"));
const uuid_1 = require("uuid");
const app_1 = require("../app");
/**
 * Scheduler app.
 * Facebook post scheduling app. Allow to schedule facebook post and controls the system and
 * checks if the system is working.
 */
class PostScheduler {
    constructor() {
        /**
         * Collection of all the jobs programmed.
         */
        this._jobsCollection = [];
        /**
         *	check if job with given id is running
         * @param id Job id
         * @returns boolean
         */
        this.jobExists = (id) => {
            const found = this._jobsCollection.find((job) => job.id === id);
            return !!found;
        };
        /**
         * When server inits, recover the jobs saved in bd and set them up again into scheduler.
         */
        this.recoverStoredJobs = () => __awaiter(this, void 0, void 0, function* () {
            // get saved jobs
            const jobs = yield app_1.firestore.getJobsProgrammed();
            // if jobs found in firestore, add to scheduler tasks
            jobs &&
                jobs.length > 0 &&
                jobs.forEach((_job) => {
                    const job = node_schedule_1.default.scheduleJob({
                        second: 0,
                    }, () => {
                        console.log(`Post id: ${_job.id}\nTitle: ${_job.title}\nMessage: ${_job.message}`);
                    });
                    // add job to collection
                    this._jobsCollection.push({ id: _job.id, job });
                });
            console.log("jobs restored succesfully!");
        });
        this.recoverStoredJobs();
    }
    /**
     * Program a job add it in the collection and save it in firestore.
     */
    addJob(postBody) {
        // assign id
        const id = (0, uuid_1.v4)();
        //
        const job = node_schedule_1.default.scheduleJob({
            second: 0,
        }, () => {
            console.log(`Post id: ${id}\nTitle: ${postBody.title}\nMessage: ${postBody.message}`);
        });
        // add job to collection
        this._jobsCollection.push({ id, job });
        // return id
        return { id, job };
    }
    /**
     *
     * @returns active programmed jobs collection
     */
    getJobs() {
        return this._jobsCollection.map((jobs) => {
            return jobs.id;
        });
    }
    /**
     * Cancell the next executions of the job with the given id
     * @param id job id
     */
    cancellJob(id) {
        // find job in collection
        const job = this._jobsCollection.find((jobs) => {
            return jobs.id === id;
        });
        // cancel schedule job
        job === null || job === void 0 ? void 0 : job.job.cancel();
        // delete schedule from sistem's schedule collection
        const updatedCollection = this._jobsCollection.filter((job) => job.id !== id);
        this._jobsCollection = updatedCollection;
    }
}
exports.default = PostScheduler;
//
//# sourceMappingURL=scheduler.js.map