// imports
import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";
import { facebook, firestore } from "../app";
import { JobType, PageConfigType, GroupConfigType } from "../types/jobs";

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
		// this.recoverStoredJobs();
	}

	/**
	 * Program a new job and return job reference
	 */
	public async addPagePostJob(page_post: PageConfigType, workspaceID: string): Promise<JobType> {
		// assign id
		const id = uuidv4();
		// job
		let job;

		/** DEBUG */
		try {
			const postPublished = await facebook.createNewPagePost(page_post, workspaceID);
		} catch (error) {
			console.log("🚀 ~ file: scheduler.ts:35 ~ PostScheduler ~ addPagePostJob ~ error", error);
		}

		// configure schedule
		if (page_post.schedule_config && page_post.schedule_config.hour && page_post.schedule_config.minute) {
			const rule = {
				dayOfWeek: page_post.schedule_config.date,
				hour: page_post.schedule_config.hour,
				minute: page_post.schedule_config.minute,
			};
			job = schedule.scheduleJob(rule, async () => {
				// create a new facebook post
				try {
					const postPublished = await facebook.createNewPagePost(page_post, workspaceID);
					console.log(postPublished);
				} catch (error) {
					console.log("🚀 ~ file: scheduler.ts:44 ~ PostScheduler ~ job=schedule.scheduleJob ~ error", error);
				}
			});
		}
		// check if job created successfully
		if (!job) {
			throw new Error("Error creating new job in scheduler");
		}
		// add job to collection
		this._jobsCollection.push({ id, job, workspace: workspaceID });

		// return job data
		return { id, job, workspace: workspaceID };
	}

	/**
	 * Create a job for each group job config passed from frontend
	 * @param sharing_groups group data used to create the jobs for each group
	 */
	public addGroupsPosts(sharing_groups: GroupConfigType[]) {
		// create a job for each group

		sharing_groups.forEach((groupConfig) => {
			// own group logic
			if (groupConfig.group.administrator) {
				const rule = {
					dayOfWeek: groupConfig.schedule.date,
					hour: groupConfig.schedule.hour,
					minute: groupConfig.schedule.minute,
				};
				schedule.scheduleJob(rule, () => {
					// get last post_scope post published
					console.log(groupConfig);
					// emit dispatcher to chrome extension
				});
			}
		});
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
		// find job in collection
		const job = this._jobsCollection.find((jobs) => {
			return jobs.id === id;
		});

		// cancel schedule job
		job?.job.cancel();

		// delete schedule from sistem's schedule collection
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
		const jobs = await firestore.getJobsProgrammed();
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
				this._jobsCollection.push({ id: _job.id, job, workspace: _job.workspace });
			});

		console.log("jobs restored succesfully!");
	};
}

export default PostScheduler;
//
