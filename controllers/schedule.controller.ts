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

	//
	try {
		// get user workspace
		if (user) {
			const userWorkspace = await firestore.getUserWorkspaceReference(user.uid);
			if (userWorkspace) {
				workspaceID = userWorkspace.id;
			}
		}

		if (workspaceID) {
			/** Jobs creation */

			// create a new post scope
			const postScopeReference = await firestore.createNewPostScope(body, workspaceID);

			// create page post job
			const pagePostJob = scheduler.createPagePostJob(body.page_post, workspaceID, postScopeReference.id);

			// update page_post_config
			firestore.updatePagePostConfig(postScopeReference.id, pagePostJob);

			// create groups to share jobs
			const groupsShareJobs = scheduler.createGroupPosts(body.sharing_groups, postScopeReference.id);
		}

		return res.json({ ok: true, msg: "job created successfully!" });
	} catch (error) {
		console.log("🚀 ~ file: schedule.controller.ts:44 ~ addJob ~ error", error);
		res.status(500).json({ ok: false, msg: "Server error, Couldn't create the jobs successfully" });
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

	// change status in firestore
	firestore.changeJobStatus(id, "trash");

	//
	return res.json({ ok: true, msg: `job ${id} deleted succesfully` });
};
