import axios from "axios";

// constants
const FB_APP_ID = process.env.FB_APP_ID;
const FB_APP_SECRET = process.env.FB_APP_SECRET;

// types
interface LongLiveTokenResponse {
	access_token: string;
}

/**
 * Generate a new Facebook Long Lived Access Token
 * @param access_token facebook oauth access_token
 */
export const getLongLivedToken = async (access_token: string) => {
	try {
		const fbRes = await axios.get<LongLiveTokenResponse>(
			`https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${access_token}`
		);
		return fbRes.data.access_token;
	} catch (error) {
		throw error;
	}
};

export const isLongLivedTokenValid = (longLivedToken: string) => {};
