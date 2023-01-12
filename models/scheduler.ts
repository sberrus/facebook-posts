// imports
import schedule from "node-schedule";
import { v4 as uuidv4 } from "uuid";
import { facebook, firestore } from "../app";
import { JobType, PageConfigType, GroupConfigType, PostScopePageJobType, PostScopeGroupJobType } from "../types/jobs";

/**
 * Scheduler app.
 * Facebook post scheduling app. Allow to schedule facebook post and controls the system and
 * checks if the system is working.
 */
class Scheduler {
	/**
	 * Collection of all the jobs programmed.
	 */
	private pageJobsCollection: JobType[] = [];
	private groupJobsCollection: JobType[] = [];

	constructor() {
		// this.recoverStoredJobs();
	}

	/**
	 * Program a new job and return job reference with the page_published
	 */
	public createPagePostJob(
		page_post: PageConfigType,
		workspaceID: string,
		post_scope_id: string
	): PostScopePageJobType {
		// assign id
		const id = uuidv4();
		let job;

		// configure schedule
		if (page_post.schedule_config && page_post.schedule_config.hour && page_post.schedule_config.minute) {
			const rule = {
				dayOfWeek: page_post.schedule_config.date,
				hour: page_post.schedule_config.hour,
				minute: page_post.schedule_config.minute,
			};
			job = schedule.scheduleJob(rule, async () => {
				try {
					// create a new facebook post
					const postPublished = await facebook.createNewPagePost(page_post, workspaceID, post_scope_id);
					// update last post published
					if (postPublished) {
						await firestore.updateLastPostPublished(post_scope_id, postPublished);
					}
				} catch (error) {
					console.log("🚀 ~ file: scheduler.ts:44 ~ PostScheduler ~ job=schedule.scheduleJob ~ error", error);
				}
			});
		}
		// check if job created successfully
		if (!job) {
			throw new Error("Scheduler Error: error creating new job in scheduler");
		}
		// add job to collection
		this.pageJobsCollection.push({ id, job, workspace: workspaceID });

		// return job data
		return {
			...page_post,
			job_id: id,
		};
	}

	/**
	 * Create a job for each group job config passed from frontend
	 * @param sharing_groups group data used to create the jobs for each group
	 */
	public createGroupPosts(sharing_groups: GroupConfigType[], post_scope_id: string, workspaceID: string) {
		// collection
		let jobs: PostScopeGroupJobType[] = [];
		// create a job for each group
		sharing_groups.forEach((groupConfig) => {
			const id = uuidv4();
			const rule = {
				dayOfWeek: groupConfig.schedule.date,
				hour: groupConfig.schedule.hour,
				minute: groupConfig.schedule.minute,
			};

			// own group job logic
			if (groupConfig.group.administrator) {
				const groupJob = schedule.scheduleJob(rule, async () => {
					try {
						await facebook.shareLastPostInOwnGroups(post_scope_id, groupConfig.group.id);
					} catch (error) {
						console.log("🚀 ~ file: scheduler.ts:79 ~ Scheduler ~ schedule.scheduleJob ~ error", error);
					}
				});

				// save
				this.groupJobsCollection.push({ id, job: groupJob, workspace: workspaceID });
				jobs.push({ ...groupConfig.group, job_id: id, schedule: groupConfig.schedule });
			}

			// external group logic
			if (!groupConfig.group.administrator) {
				const groupJob = schedule.scheduleJob(rule, () => {
					try {
						facebook.shareLastPostInExternalGroups(post_scope_id);
					} catch (error) {
						console.log(error);
					}
				});
				// save
				this.groupJobsCollection.push({ id, job: groupJob, workspace: workspaceID });
				jobs.push({ ...groupConfig.group, job_id: id, schedule: groupConfig.schedule });
			}
		});

		return jobs;
	}

	/**
	 *
	 * @returns active programmed jobs collection
	 */
	public getJobs() {
		console.log(this.pageJobsCollection);
		console.log(this.groupJobsCollection);
		const pageJobs = this.pageJobsCollection.map((jobs) => {
			return jobs.id;
		});
		const groupsJobs = this.groupJobsCollection.map((jobs) => {
			return jobs.id;
		});

		return {
			pageJobs,
			groupsJobs,
		};
	}

	/**
	 * Cancell the next executions of the job with the given id
	 * @param id job id
	 */
	public cancellJob(id: string) {
		// find job in collection
		const job = this.pageJobsCollection.find((jobs) => {
			return jobs.id === id;
		});

		// cancel schedule job
		job?.job.cancel();

		// delete schedule from sistem's schedule collection
		const updatedCollection = this.pageJobsCollection.filter((job) => job.id !== id);
		this.pageJobsCollection = updatedCollection;
	}

	/**
	 *	check if job with given id is running
	 * @param id Job id
	 * @returns boolean
	 */
	public jobExists = (id: string): boolean => {
		const found = this.pageJobsCollection.find((job) => job.id === id);

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
				this.pageJobsCollection.push({ id: _job.id, job, workspace: _job.workspace });
			});

		console.log("jobs restored succesfully!");
	};
}

export default Scheduler;
//
