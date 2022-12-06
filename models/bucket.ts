import { Request } from "express";
import { format } from "util";
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
	public async uploadFile(req: Request) {
		try {
			// Create a new blob in the bucket and upload the file data.
			const blob = this.bucket.file(`images/${req.file?.originalname!}`);
			const blobStream = blob.createWriteStream({
				resumable: false,
			});

			blobStream.on("error", (err) => {
				throw err.message;
			});

			blobStream.on("finish", async () => {
				// Create URL for directly file access via HTTP.
				const publicUrl = format(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);

				try {
					// Make the file public
					await this.bucket.file(`images/${req.file?.originalname!}`).makePublic();
				} catch (err) {
					throw {
						message: `Uploaded the file successfully: ${req.file?.originalname}, but public access is denied!`,
						url: publicUrl,
					};
				}
			});

			blobStream.end(req.file?.buffer);
		} catch (err) {
			throw {
				message: `Could not upload the file: ${req.file?.originalname}. ${err}`,
			};
		}
	}

	/**
	 * Get a list of all files
	 */
	public async getFilesList() {
		try {
			const [files] = await this.bucket.getFiles();

			return files.map((file) => {
				return {
					name: file.name,
					url: file.metadata.mediaLink,
				};
			});
		} catch (err) {
			console.log("🚀 ~ file: bucket.ts:69 ~ BucketController ~ getFilesList ~ err", err);
			throw err;
		}
	}
}

export default BucketController;
