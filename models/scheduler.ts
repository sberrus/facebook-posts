// imports
import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";
import { JobType } from "../types/jobs";

/**
 * Scheduler app.
 * Facebook post scheduling app. Allow to schedule facebook post and controls the system and
 * checks if the system is working.
 */
class PostScheduler {
	/**
	 * Collection of all the jobs programmed.
	 */
	private _jobsCollection: JobType[] = [];

	/**
	 * Add the job to the collection and save it in firestore.
	 */
	public addJob(): JobType {
		// create job
		const count = this._jobsCollection.length;
		const job = schedule.scheduleJob({ second: 0 }, () => {
			console.log(`Job: ${count}`);
		});
		// assign id
		const id = uuidv4();

		// add job to collection
		this._jobsCollection.push({ id, job });

		// return id
		return { id, job };
	}

	public getJobs(): string[] {
		return this._jobsCollection.map((jobs) => {
			return jobs.id;
		});
	}
}

export default PostScheduler;
