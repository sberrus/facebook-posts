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

		//
		this.getImage();
	}

	/** todo: Crear peticion con axios para obtener el blob y devolverlo para que pueda usarlo facebook. */
	// public getImage = async () => {
	// 	try {
	// 		const dateExp = new Date();
	// 		dateExp.setHours(dateExp.getHours() + 1);
	// 		console.log("Url expira en: ", dateExp);
	// 		const url = await this.bucket
	// 			.file("Captura de pantalla_20221124_013328.png")
	// 			.getSignedUrl({ action: "read", expires: dateExp });
	// 		console.log(url);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	public getImage = async () => {
		try {
			const file = await this.bucket.file("Captura de pantalla_20221124_013328.png").download();
			return file;
		} catch (error) {
			console.log(error);
		}
	};
}

export default BucketController;
