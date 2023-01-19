// imports
import { Request, Response } from "express";
import { facebook, firestore } from "../app";
import { WorkspaceType } from "../types/workspace";

/**
 * Get the current firebase user workspace
 */
export const getWorkspace = async (req: Request, res: Response) => {
	// firebase user
	const user = req.firebaseUser;
	// workspace
	let workspace;
	// Get workspace
	if (user) {
		workspace = await firestore.getUserWorkspace(user?.uid);
	}

	// Hide workspace Long Lived Token
	if (workspace) {
		delete workspace.longLivedToken;
	}

	res.json({ ok: true, workspace });
};

export const createNewWorkspaceAndUser = async (req: Request, res: Response) => {
	// get user credentials
	const user = req.firebaseUser;
	try {
		if (user) {
			// create new User
			await firestore.addNewUser(user.uid);

			// checks if user is in any workspace
			const userWorkspace = await firestore.getUserWorkspace(user.uid);

			// workspace exitst
			if (userWorkspace) {
				return res.json({
					ok: false,
					msg: `User is already registered in workspace ${userWorkspace.facebook_admin}`,
				});
			}

			// create new workspace
			const documentData: WorkspaceType = {
				facebook_admin: (user.email && user.email) || "error check server",
				linked_pages: [],
				linked_groups: [],
				managers: [],
			};
			const newWorkspace = await firestore.createNewWorkspace(documentData);

			// update user workspace
			if (newWorkspace) {
				const success = await firestore.updateUserWorkspace(user.uid, newWorkspace.id);

				if (success) {
					return res.json({
						ok: true,
						msg: "New workspace created successfully!",
					});
				}
			}
		}
		//
		res.json({ ok: false, msg: "Error trying to create new workspace" });
	} catch (error) {
		console.log(error);
	}
};

/**
 * Add a page to workspace pages
 */
export const addPageToWorkspace = async (req: Request, res: Response) => {
	// Get page to add id
	const pageID = req.body.page_id;
	// Get firebase user
	const user = req.firebaseUser;
	//
	let userWorkspace;
	let pageData;

	// get user workspace
	if (user) {
		try {
			userWorkspace = await firestore.getUserWorkspace(user.uid);
		} catch (error) {
			res.status(500).json({ ok: false, msg: "Error trying to fetch user workspace information" });
			console.log("🚀 ~ file: workspace.controller.ts:40 ~ addPageToWorkspace ~ error", error);
		}
	}
	// get page data
	if (userWorkspace?.longLivedToken) {
		try {
			pageData = await facebook.getPage(pageID, userWorkspace.longLivedToken);
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:50 ~ addPageToWorkspace ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to fetch page data" });
		}
	}

	// TODO: CHECK IF PAGE ALREADY EXISTS IN WORKSPACE PAGES

	// save data in BD
	if (pageData && user) {
		try {
			await firestore.addPageToUserWorkspace(pageData, user.uid);
			return res.json({ ok: true });
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:63 ~ addPageToWorkspace ~ error", error);
			return res.json({ ok: false, msg: "Error trying to add page to workspace pages" });
		}
	}

	//
	res.status(500).json({
		ok: false,
		msg: "Error adding page to workspace page. if you are reading this... Good luck t.t",
	});
};

export const getAdminPages = async (req: Request, res: Response) => {
	// firebase user
	const user = req.firebaseUser;
	// workspace
	let workspace;

	if (user) {
		try {
			// get workspace
			workspace = await firestore.getUserWorkspace(user?.uid);
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:45 ~ getAdminPages ~ error", error);
			return res.status(500).json({ ok: false, msg: "Server error trying to fetch user workspace" });
		}
	}

	if (workspace?.longLivedToken) {
		try {
			const pagesRes = await facebook.getUserPages(workspace.longLivedToken);

			return res.json({ ok: true, pages: pagesRes });
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:57 ~ getAdminPages ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to fetch admin pages" });
		}
	}
};

export const deleteWorkspacePage = async (req: Request, res: Response) => {
	// get user uid
	const user = req.firebaseUser;
	// get page uid to delete
	const pageID = req.body.page_id;

	if (user && pageID) {
		try {
			await firestore.deleteWorkspacePage(user.uid, pageID);
			return res.json({ ok: true, msg: "Page removed successfully!" });
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:117 ~ deleteWorkspacePage ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error removing page from workspace pages" });
		}
	}

	res.status(500).json({ ok: false, msg: "Error removing page... good luck :) <3" });
};
