// imports
import { getFirestore, Firestore, CollectionReference, FieldValue } from "firebase-admin/firestore";
// types
import { FacebookPageResponseType } from "../types";
import {
	PostDataType,
	PostPublishedType,
	PostScopeGroupJobType,
	PostScopePageJobType,
	PostScopeType,
} from "../types/jobs";
import { UserInWorkspace, WorkspaceType } from "../types/workspace";

/**
 * Firestore controller
 */

class FirestoreController {
	// firestore instance
	private db: Firestore;
	// firestore jobs reference
	private jobsReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private workspacesReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private usersReference: CollectionReference<FirebaseFirestore.DocumentData>;
	private postScopeReference: CollectionReference<FirebaseFirestore.DocumentData>;

	//
	constructor() {
		// get firestore instance
		this.db = getFirestore();
		// get firestore references
		this.jobsReference = this.db.collection("jobs");
		this.workspacesReference = this.db.collection("workspaces");
		this.usersReference = this.db.collection("users");
		this.postScopeReference = this.db.collection("post_scope");
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

	public async createNewWorkspace(documentData: WorkspaceType) {
		try {
			const success = await this.workspacesReference.add(documentData);
			if (success) {
				return success;
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Retrieves the LongLivedToken for the given workspaceID
	 * @param workspaceID workspace collection document id
	 * @returns
	 */
	public async getWorkspaceLongLivedToken(workspaceID: string) {
		try {
			const res = await this.workspacesReference.doc(workspaceID).get();
			const workspace = res.data() as WorkspaceType;

			return workspace.longLivedToken;
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:111 ~ FirestoreController ~ getLongLivedToken ~ error", error);
			throw new Error("Firestore error: Couldn`t get longLivedToken");
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
	 * Retrieve the list of all workspace jobs.
	 * @param workspaceID Firestore workspace collection document id.
	 * @returns
	 */
	public async getWorkspaceJobs(workspaceID: string) {
		try {
			const postScopeJobs = await this.postScopeReference
				.where("workspaceID", "==", workspaceID)
				.orderBy("updated_at", "desc")
				.get();
			return postScopeJobs.docs.map((job) => job.data());
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:374 ~ FirestoreController ~ getWorkspaceJobs ~ error", error);
			throw new Error("Firestore Error: Error fetching post_scope jobs");
		}
	}

	/**
	 * Get user data by its firebase uid
	 */
	public async getUser(uid: string) {
		// get users passed their
		try {
			const user = await this.usersReference.doc(uid).get();
			if (user.exists) {
				return user.data() as UserInWorkspace;
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:149 ~ FirestoreController ~ getUser ~ error", error);
			throw error;
		}
	}

	public async addNewUser(uid: string) {
		try {
			// check if user exists
			const checkedUser = await this.usersReference.doc(uid).get();

			// if user exists return
			if (checkedUser.exists) {
				return;
			}

			// if no user create new user
			const newUser = await this.usersReference.doc(uid).set({});
			if (newUser) {
				return newUser;
			}
		} catch (error) {
			console.log(error);
		}
	}

	/**
	 * Updates the user workspace
	 * @param uid firestore user token uid
	 * @param workspace workspace collection document id
	 * @returns
	 */
	public async updateUserWorkspace(uid: string, workspace: string) {
		try {
			const updateRes = await this.usersReference.doc(uid).update({ workspace });

			if (updateRes) {
				return updateRes;
			}
		} catch (error) {
			console.log(error);
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
			if (!user) {
				throw new Error("Firestore error: There is not user in users collection");
			}

			// Get workspace
			if (user) {
				const workspace = await this.workspacesReference.doc(user.workspace).get();
				if (workspace.exists) {
					return workspace;
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:174 ~ FirestoreController ~ getUserWorkspace ~ error", error);
			throw error;
		}
	}

	/**
	 * Get the user's authenticated workspace or undefined if no workspace detected for the user
	 */
	public async getUserWorkspace(firebaseUserUid: string) {
		try {
			// get user
			const user = await this.getUser(firebaseUserUid);

			// return workspace data
			if (user && user.workspace) {
				// find workspace
				const workspace = await this.workspacesReference.doc(user.workspace).get();
				if (workspace.exists) {
					return workspace.data() as WorkspaceType;
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:195 ~ FirestoreController ~ getUserWorkspace ~ error", error);
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
			if (!user) {
				console.log("🚀 ~ file: firestore.ts:166 ~ FirestoreController ~ getUserWorkspace ~ exists", user);
				return;
			}

			// if user exists, save Long lived Token
			if (user) {
				// find workspace
				await this.workspacesReference.doc(user.workspace).update({
					longLivedToken: longLivedToken,
				});
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:174 ~ FirestoreController ~ getUserWorkspace ~ error", error);
			throw error;
		}
	}

	/**
	 * Add page to workspace
	 */
	public async addPageToUserWorkspace(page: FacebookPageResponseType, firebaseUid: string) {
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

	/**
	 * Delete workspace page
	 */
	public async deleteWorkspacePage(firebaseUid: string, pageID: string) {
		let workspacePages: FacebookPageResponseType[] = [];
		let workspaceRef;
		// Get workspace reference
		try {
			workspaceRef = await this.getUserWorkspaceReference(firebaseUid);
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:268 ~ FirestoreController ~ deleteWorkspacePage ~ error", error);
			throw new Error("Error fetching user workspace");
		}

		// Get current pages
		try {
			if (workspaceRef) {
				const document = await workspaceRef.ref.get();
				const workspace = document.data();
				if (workspace) {
					workspacePages = workspace.linked_pages;
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:282 ~ FirestoreController ~ deleteWorkspacePage ~ error", error);
			throw new Error("Error getting workspace ");
		}

		// Update pages
		if (workspaceRef && workspacePages) {
			try {
				await workspaceRef.ref.update({
					linked_pages: workspacePages.filter((page) => page.id !== pageID),
				});
			} catch (error) {
				console.log("🚀 ~ file: firestore.ts:291 ~ FirestoreController ~ deleteWorkspacePage ~ error", error);
				throw new Error("Error updating workspace pages");
			}
		}
	}

	/**
	 * Create a new post_scope
	 * @param workspaceID workspace document id
	 */
	public async createNewPostScope(body: PostDataType, workspaceID: string) {
		try {
			const postScope = {
				title: body.title,
				workspaceID,
				groups: {
					owned: [],
					external: [],
				},
				post_scope_status: true,
				created_at: Date.now(),
				updated_at: Date.now(),
			};

			const res = await this.postScopeReference.add(postScope);
			return res;
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:301 ~ FirestoreController ~ createNewPostScope ~ error", error);
			throw new Error("Firebase Error: error creating new post_scope document");
		}
	}

	/**
	 * retrieves the post_scope document reference given its document id
	 * @param post_scope_id post_scope document id.
	 */
	public async getPostScopeReference(post_scope_id: string) {
		try {
			const postScopeReference = await this.postScopeReference.doc(post_scope_id).get();

			return postScopeReference;
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:333 ~ FirestoreController ~ getPostScopeReference ~ error", error);
			throw new Error("Firebase Error: Error fetching post_scope reference");
		}
	}

	/**
	 * Updates the last post published for the given post_scope_id
	 */
	public async updateLastPostPublished(post_scope_id: string, last_post_published: PostPublishedType) {
		try {
			await this.postScopeReference.doc(post_scope_id).update({
				last_post_published,
			});
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:346 ~ FirestoreController ~ updateLastPostPublished ~ error", error);
			throw new Error("Firestore Error: Coudln't update post_scope last_post_published");
		}
	}

	public async updatePagePostConfig(post_scope_id: string, page_post_job: PostScopePageJobType) {
		try {
			await this.postScopeReference.doc(post_scope_id).update({
				page_post_job,
				id: post_scope_id,
			});
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:346 ~ FirestoreController ~ updateLastPostPublished ~ error", error);
			throw new Error("Firestore Error: Coudln't update post_scope last_post_published");
		}
	}

	public async updatePagePostGroups(post_scope_id: string, group: PostScopeGroupJobType[]) {
		try {
			await this.postScopeReference.doc(post_scope_id).update({
				groups: {
					owned: group.filter((job) => job.administrator),
					external: group.filter((job) => !job.administrator),
				},
			});
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:346 ~ FirestoreController ~ updateLastPostPublished ~ error", error);
			throw new Error("Firestore Error: Coudln't update post_scope last_post_published");
		}
	}

	/**
	 * Get single job scope id from job_scope collection
	 * @param job_scope_id job_scope collection id
	 */
	public getJobScope = async (job_scope_id: string) => {
		try {
			const jobScope = await this.postScopeReference.doc(job_scope_id).get();
			return jobScope.data() as PostScopeType;
		} catch (error) {
			console.log("🚀 ~ file: firestore.ts:354 ~ FirestoreController ~ getJobScope= ~ error", error);
			throw new Error("Firestore Error: couldn`t get job_scope");
		}
	};
}
//
export default FirestoreController;
