// imports
import axios from "axios";

// type
interface LongLiveTokenResponse {
	access_token: string;
}
class FacebookController {
	private FB_APP_ID: string;
	private FB_APP_SECRET: string;

	constructor() {
		this.FB_APP_ID = process.env.FB_APP_ID || "";
		this.FB_APP_SECRET = process.env.FB_APP_SECRET || "";
	}

	/**
	 * Get the fb token user information
	 * @param token
	 * @returns
	 */
	public async getTokenData(token: string) {
		try {
			const fbRes = await axios(
				`https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cemail&access_token=${token}`
			);

			return fbRes.data;
		} catch (error: any) {
			throw error.response.data;
		}
	}

	/**
	 * Get a long lived token for the given user token
	 * @param token facebook user token
	 * @returns
	 */
	public async generateLongLivedToken(token: string) {
		try {
			const fbRes = await axios.get<LongLiveTokenResponse>(
				`https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.FB_APP_ID}&client_secret=${this.FB_APP_SECRET}&fb_exchange_token=${token}`
			);
			return fbRes.data.access_token;
		} catch (error: any) {
			throw error.response.data;
		}
	}

	/**
	 * returns the pages the admin manage
	 * @param token admin long lived token
	 * @returns
	 */
	public async getUserPages(token: string) {
		try {
			const fbRes = await axios(
				`https://graph.facebook.com/v15.0/me/accounts?fields=name,id,picture&access_token=${token}`
			);

			return fbRes.data.data;
		} catch (error: any) {
			throw error.response.data;
		}
	}
}

export default FacebookController;
