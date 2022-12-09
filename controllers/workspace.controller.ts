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

export const addPageToWorkspace = (req: Request, res: Response) => {
	// Get firebase user
	const user = req.firebaseUser;

	//
	res.json({ ok: true });
};

export const getAdminPages = async (req: Request, res: Response) => {
	// firebase user
	const user = req.firebaseUser;
	// workspace
	let workspace;
	// pages
	let pages;

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
