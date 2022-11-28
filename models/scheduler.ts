// imports
import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../app";
import { JobType, PostRequestBodyType } from "../types/jobs";

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

	constructor() {
		this.recoverStoredJobs();
	}
	/**
	 * Program a job add it in the collection and save it in firestore.
	 */
	public addJob(postBody: PostRequestBodyType): JobType {
		// assign id
		const id = uuidv4();

		//
		const job = schedule.scheduleJob(
			{
				second: 0,
			},
			() => {
				console.log(`Post id: ${id}\nTitle: ${postBody.title}\nMessage: ${postBody.message}`);
			}
		);

		// add job to collection
		this._jobsCollection.push({ id, job });

		// return id
		return { id, job };
	}

	/**
	 *
	 * @returns active programmed jobs collection
	 */
	public getJobs(): string[] {
		return this._jobsCollection.map((jobs) => {
			return jobs.id;
		});
	}

	/**
	 * Cancell the next executions of the job with the given id
	 * @param id job id
	 */
	public cancellJob(id: string) {
		const job = this._jobsCollection.find((jobs) => {
			return jobs.id === id;
		});
		job?.job.cancel();

		const updatedCollection = this._jobsCollection.filter((job) => job.id !== id);
		this._jobsCollection = updatedCollection;
	}

	/**
	 *	check if job with given id is running
	 * @param id Job id
	 * @returns boolean
	 */
	public jobExists = (id: string): boolean => {
		const found = this._jobsCollection.find((job) => job.id === id);

		return !!found;
	};

	/**
	 * When server inits, recover the jobs saved in bd and set them up again into scheduler.
	 */
	private recoverStoredJobs = async () => {
		// get saved jobs
		const jobs = await firestore.getJobs();
		// if jobs found in firestore, add to scheduler tasks
		jobs &&
			jobs.length > 0 &&
			jobs.forEach((_job) => {
				const job = schedule.scheduleJob(
					{
						second: 0,
					},
					() => {
						console.log(`Post id: ${_job.id}\nTitle: ${_job.title}\nMessage: ${_job.message}`);
					}
				);
				// add job to collection
				this._jobsCollection.push({ id: _job.id, job });
			});

		console.log("jobs restored succesfully!");
	};
}

export default PostScheduler;
//
