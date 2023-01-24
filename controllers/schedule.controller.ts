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

			// create groups to share jobs
			const groupsShareJobs = scheduler.createGroupPosts(body.sharing_groups, postScopeReference.id, workspaceID);

			// update page config data
			firestore.updatePagePostConfig(postScopeReference.id, pagePostJob);

			// update groups
			firestore.updatePagePostGroups(postScopeReference.id, groupsShareJobs);
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
	return res.json({ ok: true, pagesJobs: jobs.pageJobs, groupsJobs: jobs.groupsJobs });
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

/**
 * Retrieves the user workspace jobs
 */
export const getWorkspaceJobs = async (req: Request, res: Response) => {
	// user
	const user = req.firebaseUser;
	// workspace
	let workspace;
	// pagination
	const current_page = Number(req.query["current_page"]) || 1;

	
	try {
		// get workspace
		if (user) {
			workspace = await firestore.getUserWorkspaceReference(user.uid);
		}
		// get jobs
		if (workspace) {
			const jobsRes = await firestore.getWorkspaceJobs(workspace.id, current_page);
			return res.json(jobsRes);
		}

		res.status(500).json({ ok: false, msg: "Server Error: Coudln't get workspace jobs, try again later" });
	} catch (error) {
		console.log("🚀 ~ file: schedule.controller.ts:91 ~ getWorkspaceJobs ~ error", error);
		res.status(500).json({ ok: false, msg: "Server Error: Error getting post_scope jobs" });
	}
};
