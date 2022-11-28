// imports
import { Request, Response } from "express";
// import { createPagePost, getPageAccessToken } from "../helpers/facebookPosts";
// scheduler app
import { firestore, scheduler } from "../app";
import { FacebookPostType } from "../types/jobs";

/**
 *	create a new job and save it into firestore bd.
 */
export const addJob = async (req: Request, res: Response) => {
	// req body
	const body: FacebookPostType = req.body;

	// create a new job
	const jobData = scheduler.addJob();

	try {
		// save job in firestore
		await firestore.createJob(jobData, body);
		return res.json({ ok: true, msg: `job ${jobData.id} succesfully created` });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ ok: false, msg: "Server error" });
	}
};

export const getProgramedJobs = (req: Request, res: Response) => {
	const jobs = scheduler.getJobs();
	return res.json({ ok: true, jobs });
};
