// imports
import { Request, Response } from "express";
// import { createPagePost, getPageAccessToken } from "../helpers/facebookPosts";
// scheduler app
import { firestore, scheduler } from "../app";
// types
import { PostDataType } from "../types/jobs";

/**
 *	create a new job and save it into firestore bd.
 */
export const addJob = async (req: Request, res: Response) => {
	// get firebase user
	const user = req.firebaseUser;
	// req body
	const body = req.body as PostDataType;
	// get workspace ID
	let workspaceID: string | undefined;
	// get workspace
	if (user) {
		try {
			const userWorkspace = await firestore.getUserWorkspaceReference(user.uid);
			if (userWorkspace) {
				workspaceID = userWorkspace.id;
			}
		} catch (error) {
			console.log("🚀 ~ file: schedule.controller.ts:27 ~ addJob ~ error", error);
			return res.status(500).json({ ok: false, msg: "Server error" });
		}
	}

	if (workspaceID) {
		// create a new job post
		try {
			const pagePostJob = scheduler.addPagePostJob(body.page_post, workspaceID);
			// job created
			return res.json({ ok: true, msg: "job created successfully!" });
		} catch (error) {
			console.log("🚀 ~ file: schedule.controller.ts:41 ~ addJob ~ error", error);
			return res.status(500).json({ ok: false, msg: error });
		}

		// // create groups jobs
		// if (body.sharing_groups.length > 0) {
		// 	const groupsJobs = scheduler.addGroupsPosts(body.sharing_groups);
		// }
	}

	res.status(500).json({ ok: false, msg: "Error in server" });
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

	// change status in firestore
	firestore.changeJobStatus(id, "trash");

	//
	return res.json({ ok: true, msg: `job ${id} deleted succesfully` });
};
