// imports
import { getFirestore, Firestore, CollectionReference, FieldValue } from "firebase-admin/firestore";
import { PageType } from "../types";
import { PostRequestBodyType, JobType } from "../types/jobs";

/**
 * Firestore controller
 */

class FirestoreController {
	// firestore instance
	private db: Firestore;
	// firestore jobs reference
	private jobsReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private tokensReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private workspacesReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private usersReference: CollectionReference<FirebaseFirestore.DocumentData>;

	//
	constructor() {
		// get firestore instance
		this.db = getFirestore();
		// get firestore references
		this.jobsReference = this.db.collection("jobs");
		this.tokensReference = this.db.collection("tokens");
		this.workspacesReference = this.db.collection("workspaces");
		this.usersReference = this.db.collection("users");
	}

	/**
	 *
	 * @returns Jobs collections saved in db
	 */
	public async getJobsProgrammed() {
		try {
			const snapshot = await this.jobsReference.where("job_status", "==", "programmed").get();
			return snapshot.docs.map((doc) => doc.data());
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:33 ~ FirestoreController ~ getJobsProgrammed ~ error", error);
			throw error;
		}
	}

	/**
	 * Insert new document with job's information
	 */
	public async createJob(
		{ id }: JobType,
		{
			title = "",
			message = "",
			type = "text",
			url = "",
			emotion = "",
			asset_src = "",
			location = "",
			schedule_config,
		}: PostRequestBodyType
	) {
		try {
			await this.jobsReference.add({
				id,
				title,
				message,
				type,
				url,
				emotion,
				asset_src,
				location,
				schedule_config,
				job_status: "programmed",
			});
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:70 ~ FirestoreController ~ error", error);
			throw new Error("Error when adding doc to firestore");
		}
	}

	/**
	 * Change the job's status in firestore document
	 * @param id firestore's job id. Don't confuse with firestore auto-generated document id. It's the id property
	 * given by the system.
	 * @param status new status for the job. EJ: "programmed" | "draft" | "trash".
	 */
	public async changeJobStatus(id: string, status: string) {
		try {
			// find single job
			const job = await this.jobsReference.where("id", "==", id).get();
			// check if job exists
			if (job.empty) {
				return;
			}

			const foundJobRef = job.docs[0].ref;
			await foundJobRef.update({ job_status: status });
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:93 ~ FirestoreController ~ changeJobStatus ~ error", error);
			throw new Error("Error in server");
		}
	}

	/**
	 * Save long live token into workspace collection
	 */
	public async saveLongLivedToken(owner: string, token: string) {
		try {
			this.tokensReference.doc(owner).set({ LLT: token });
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:103 ~ FirestoreController ~ saveLongLivedToken ~ error", error);
			throw error;
		}
	}

	public async getLongLivedToken(owner: string) {
		try {
			const res = await this.tokensReference.doc(owner).get();
			return res.data()?.LLT;
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:111 ~ FirestoreController ~ getLongLivedToken ~ error", error);
			throw error;
		}
	}

	/**
	 * check if workspace exists, if exists returns it
	 */
	public async workspaceExists(workspace: string) {
		const res = await this.workspacesReference.get();

		console.log(res.docs[0].id); //this is the data we need to compare the existence of the workspace

		const workspaceFound = res.docs.find((doc) => {
			return doc.id === workspace;
		});

		return workspaceFound;
	}

	/**
	 * Get users data and workspace information by its firebase uid
	 */
	public async getUser(uid: string) {
		// get users passed their
		try {
			const user = await this.usersReference.doc(uid).get();
			if (user.exists) {
				return user;
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:149 ~ FirestoreController ~ getUser ~ error", error);
			throw error;
		}
	}

	/**
	 * Get user workspace information by its firebase uid ** dont try this at home
	 * @param firebaseUserUid firebase user uid
	 */
	public async getUserWorkspaceReference(firebaseUserUid: string) {
		try {
			const user = await this.getUser(firebaseUserUid);
			// check if user exists
			if (!user?.exists) {
				console.log("🚀 ~ file: firestore.ts:166 ~ FirestoreController ~ getUserWorkspace ~ exists", user?.exists);
				return;
			}

			// get firestore workspace user
			const workspaceUser = user.data();

			if (workspaceUser) {
				// find workspace
				const workspace = await this.workspacesReference.doc(workspaceUser.workspace).get();
				if (workspace.exists) {
					return workspace;
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:174 ~ FirestoreController ~ getUserWorkspace ~ error", error);
			throw error;
		}
	}

	public async getUserWorkspace(firebaseUserUid: string) {
		try {
			const user = await this.getUser(firebaseUserUid);
			// check if user exists
			if (!user?.exists) {
				console.log("🚀 ~ file: firestore.ts:166 ~ FirestoreController ~ getUserWorkspace ~ exists", user?.exists);
				return;
			}

			// get firestore workspace user
			const workspaceUser = user.data();

			if (workspaceUser) {
				// find workspace
				const workspace = await this.workspacesReference.doc(workspaceUser.workspace).get();
				if (workspace.exists) {
					return workspace.data();
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:174 ~ FirestoreController ~ getUserWorkspace ~ error", error);
			throw error;
		}
	}

	/**
	 * Save the long lived token in user's workspace
	 * @param firebaseUserUid Firebase uid
	 * @param longLivedToken Facebook long lived token
	 * @returns
	 */
	public async saveWorkspaceToken(firebaseUserUid: string, longLivedToken: string) {
		try {
			// get user data
			const user = await this.getUser(firebaseUserUid);
			if (!user?.exists) {
				console.log("🚀 ~ file: firestore.ts:166 ~ FirestoreController ~ getUserWorkspace ~ exists", user?.exists);
				return;
			}

			// get firestore workspace user
			const workspaceUser = user.data();

			// if user exists, save Long lived Token
			if (workspaceUser) {
				// find workspace
				await this.workspacesReference.doc(workspaceUser.workspace).update({
					longLivedToken: longLivedToken,
				});
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:174 ~ FirestoreController ~ getUserWorkspace ~ error", error);
			throw error;
		}
	}

	public async addPageToUserWorkspace(page: PageType, firebaseUid: string) {
		// get user workspace reference
		try {
			const userWorkspace = await this.getUserWorkspaceReference(firebaseUid);
			if (userWorkspace) {
				const userWorkspaceRef = userWorkspace.ref;
				await userWorkspaceRef.update({
					linked_pages: FieldValue.arrayUnion(page),
				});
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:247 ~ FirestoreController ~ addPageToUserWorkspace ~ error", error);
			throw new Error("Error adding the page to workspace pages");
		}
	}
}
//
export default FirestoreController;
