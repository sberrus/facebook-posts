import * as dotenv from "dotenv";
import { App, cert, initializeApp } from "firebase-admin/app";
dotenv.config();
// secrets
const GCLOUD_PROJECET_ID = process.env.GCLOUD_PROJECET_ID;
const GCLOUD_CLIENT_EMAIL = process.env.GCLOUD_CLIENT_EMAIL;
const GCLOUD_PRIVATE_KEY = process.env.GCLOUD_PRIVATE_KEY;

class FirebaseApp {
	// app instance
	private app: App;

	constructor() {
		this.app = initializeApp({
			credential: cert({
				projectId: GCLOUD_PROJECET_ID,
				clientEmail: GCLOUD_CLIENT_EMAIL,
				privateKey: GCLOUD_PRIVATE_KEY,
			}),
			storageBucket: "facebook-automate-1526f.appspot.com/",
		});
	}

	public getApp() {
		return this.app;
	}
}

export default FirebaseApp;
