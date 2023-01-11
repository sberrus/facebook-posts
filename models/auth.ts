import { getAuth, Auth } from "firebase-admin/auth";

class AuthController {
	private auth: Auth;

	constructor() {
		this.auth = getAuth();
	}

	/**
	 * Check if token is valid and returns user data if exists
	 * @param token
	 */
	public async checkAuthToken(token: string) {
		try {
			return await this.auth.verifyIdToken(token);
		} catch (error) {
			console.log(error);
		}
	}
}

export default AuthController;
