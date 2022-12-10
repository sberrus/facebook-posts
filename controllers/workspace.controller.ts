// imports
import { Request, Response } from "express";
import { facebook, firestore } from "../app";

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
	if (userWorkspace) {
		try {
			pageData = await facebook.getPage(pageID, userWorkspace.longLivedToken);
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:50 ~ addPageToWorkspace ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to fetch page data" });
		}
	}

	/**
	 * TODO CHECK IF PAGE ALREADY EXISTS IN WORKSPACE PAGES
	 */
	// check if page already exists in workspace pages

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

	if (workspace) {
		try {
			const pagesRes = await facebook.getUserPages(workspace.longLivedToken);

			return res.json({ ok: true, pages: pagesRes });
		} catch (error) {
			console.log("🚀 ~ file: workspace.controller.ts:57 ~ getAdminPages ~ error", error);
			return res.status(500).json({ ok: false, msg: "Error trying to fetch admin pages" });
		}
	}
};
