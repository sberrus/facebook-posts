import util from "util";
import Multer from "multer";
import { firestore } from "../app";

const maxSize = 15 * 1024 * 1024;

const processFile = Multer({
	storage: Multer.memoryStorage(),
	limits: { fileSize: maxSize },
}).single("file");

const processFileMiddleware = util.promisify(processFile);

export default processFileMiddleware;

export const checkIfWorkspaceExists = async (workspace: string) => {
	let found = false;

	try {
		found = await firestore.workspaceExists(workspace);
	} catch (error) {
		throw new Error("Error fetching workspaces, please try again later");
	}

	if (!found) {
		throw new Error("workspace not found");
	}
};
