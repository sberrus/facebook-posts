// imports
import { Request, Response } from "express";
// import { createPagePost, getPageAccessToken } from "../helpers/facebookPosts";
// scheduler app
import { firestore, scheduler } from "../app";
import { PostRequestBodyType } from "../types/jobs";

/**
 *	create a new job and save it into firestore bd.
 */
export const addJob = async (req: Request, res: Response) => {
	// req body
	const body: PostRequestBodyType = req.body;

	// create a new job
	const jobData = scheduler.addJob(body);

	try {
		// save job in firestore
		await firestore.createJob(jobData, body);
		return res.json({ ok: true, msg: `job ${jobData.id} succesfully created` });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ ok: false, msg: "Server error" });
	}
};

export const getProgrammedJobs = (req: Request, res: Response) => {
	const jobs = scheduler.getJobs();

	//
	return res.json({ ok: true, jobs });
};

export const deleteProgrammedJob = (req: Request, res: Response) => {
	//get job id
	const id = req.params.id;
	scheduler.cancellJob(id);

	//
	return res.json({ ok: true, msg: `job ${id} deleted succesfully` });
};
