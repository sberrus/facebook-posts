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
	public async getJobs() {
		try {
			const snapshot = await this.jobsReference.get();

			return snapshot.docs.map((doc) => doc.data());
		} catch (error) {
			console.log(error);
		}
	}

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
			});
		} catch (error) {
			console.log(error);
			throw new Error("Error when adding doc to firestore");
		}
	}
}
//
export default FirestoreController;
