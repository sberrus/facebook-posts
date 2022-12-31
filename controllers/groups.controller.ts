import { Request, Response } from "express";
import { facebook, firestore } from "../app";

export const getWorkspaceGroups = async (req: Request, res: Response) => {
	// firebase user
	const user = req.firebaseUser;
	// user workspace
	let userWorkspace;

	// get user workspace
	if (user) {
		try {
			userWorkspace = await firestore.getUserWorkspace(user?.uid);
		} catch (error) {
			console.log("🚀 ~ file: groups.controller.ts:14 ~ getWorkspaceGroups ~ error", error);
			return res.status(400).json({ ok: false, msg: "Error fetching user workspace" });
		}
	}
	// get workspace available pages
	if (userWorkspace?.longLivedToken) {
		try {
			const groups = await facebook.getUserGroups(userWorkspace.longLivedToken);
			const ownGroups = groups.filter((group) => {
				return group.administrator;
			});
			if (ownGroups) {
				return res.json({ ok: true, groups: ownGroups });
			}
		} catch (error) {
			console.log("🚀 ~ file: groups.controller.ts:25 ~ getWorkspaceGroups ~ error", error);

			return res.status(400).json({ ok: false, msg: "Error fetching workspace facebook available groups" });
		}
	}

	// dont have to get here :v
	return res.status(500).json({ ok: false, msg: "Server error trying to get firebase user" });
};

export const checkExternalGroups = async (req: Request, res: Response) => {
	const user = req.firebaseUser;
	const group = req.query["url"];

	// check if external is valid
	if (typeof group === "string" && user) {
		const splitted = group.split("/");
		const groupID = splitted[splitted.length - 1];
		try {
			const groupData = await facebook.externalGroupIsValid(user.uid, groupID);
			if (groupData) {
				return res.json({ groupData });
			}
		} catch (error) {
			return res.status(500).json({ ok: false, msg: error });
		}
	}
};
