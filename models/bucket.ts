import { Request } from "express";
import { getStorage } from "firebase-admin/storage";

/**
 * Bucket controller to get assets from server
 */
class BucketController {
	// bucket instance
	private bucket;

	constructor() {
		// initialize bucket
		this.bucket = getStorage().bucket();
	}

	/**
	 * Upload file to firestore
	 */
	public async uploadFile(req: Request, workspaceID: string) {
		if (req.file) {
			try {
				// Create a new blob in the bucket and upload the file data.
				const blob = this.bucket.file(`${workspaceID}/${req.file.originalname}`);
				const blobStream = blob.createWriteStream({
					resumable: false,
				});

				blobStream.on("error", (err) => {
					console.log(err);
				});

				blobStream.on("finish", async () => {
					if (req.file) {
						try {
							// Make the file public
							await this.bucket.file(`${workspaceID}/${req.file.originalname}`).makePublic();
						} catch (err) {
							console.log(err);
						}
					}
				});

				blobStream.end(req.file.buffer);
			} catch (err) {
				throw new Error(`Could not upload the file: ${req.file?.originalname}. ${err}`);
			}
		}
	}

	/**
	 * Get a list of all files
	 */
	public async getWorkspaceFiles(workspaceID: string) {
		try {
			const [files] = await this.bucket.getFiles({ prefix: workspaceID });

			return files.map((file) => {
				return {
					name: file.name,
					url: file.metadata.mediaLink,
					uri_encoded: encodeURIComponent(file.metadata.mediaLink),
				};
			});
		} catch (err) {
			console.log("🚀 ~ file: bucket.ts:69 ~ BucketController ~ getFilesList ~ err", err);
			throw err;
		}
	}
}

export default BucketController;
