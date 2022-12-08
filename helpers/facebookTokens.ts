import axios from "axios";

export const isLongLivedTokenValid = async (longLivedToken: string) => {
	try {
		const fbRes = await axios(
			`https://graph.facebook.com/debug_token?input_token=${longLivedToken}&access_token=${longLivedToken}`
		);

		return fbRes.data.data.is_valid;
	} catch (error: any) {
		throw error.response.data;
	}
};
