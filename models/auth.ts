import { getAuth, Auth } from "firebase-admin/auth";

class AuthController {
	private auth: Auth;

	constructor() {
		this.auth = getAuth();
	}

	/**
	 *
	 * @param token
	 * @returns boolean
	 */
	public async checkAuthToken(token: string) {
		try {
			const response = await this.auth.verifyIdToken(token);

			if (!response) {
				return false;
			}

			return true;
		} catch (error) {
			console.log("🚀 ~ file: auth.ts:18 ~ AuthController ~ checkAuthToken ~ error", error);
		}
	}
}

export default AuthController;
