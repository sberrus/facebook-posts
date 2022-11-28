// imports
import { getFirestore, Firestore, CollectionReference } from "firebase-admin/firestore";
import { PostRequestBodyType, JobType } from "../types/jobs";

/**
 * Firestore controller
 */
class FirestoreController {
	// firestore instance
	private db: Firestore;
	// firestore jobs reference
	private jobsReference: CollectionReference<FirebaseFirestore.DocumentData>;

	//
	constructor() {
		// get firestore instance
		this.db = getFirestore();
		// get firestore jobs reference
		this.jobsReference = this.db.collection("jobs");
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
			console.log(error);
		}
	}

	/**
	 * Insert new document with job's information
	 * @param param0
	 * @param param1
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
			console.log(error);
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
			throw new Error("Error in server");
		}
	}
}
//
export default FirestoreController;
