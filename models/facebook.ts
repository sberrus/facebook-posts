// imports
import axios from "axios";
import { firestore } from "../app";

// type
import { FacebookPageResponseType } from "../types/index";
import { PageConfigType, PostDataType } from "../types/jobs";
import { GroupType } from "../types/workspace";
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

	/**
	 * returns page data
	 * @param pageID facebook page id
	 * @param token facebook long lived token
	 */
	public async getPage(pageID: string, token: string): Promise<FacebookPageResponseType> {
		try {
			const fbRes = await axios(
				`https://graph.facebook.com/v15.0/${pageID}?fields=name,id,picture&access_token=${token}`
			);

			return fbRes.data;
		} catch (error: any) {
			throw error.response.data;
		}
	}

	/**
	 * Get page token
	 */
	private async getPageToken(pageID: string, longLivedToken: string) {
		try {
			const fbRes = await axios(
				`https://graph.facebook.com/v15.0/${pageID}?fields=access_token&access_token=${longLivedToken}`
			);

			return fbRes.data.access_token;
		} catch (error: any) {
			throw error.response.data;
		}
	}

	public async getUserGroups(token: string): Promise<GroupType[]> {
		try {
			const fbRes = await axios(
				`https://graph.facebook.com/v15.0/me/groups?fields=name,id,picture,administrator&access_token=${token}`
			);

			return fbRes.data.data;
		} catch (error: any) {
			throw error.response.data;
		}
	}

	/**
	 * Create new page post
	 * @param page_post page data to create the new post
	 * @param workspaceID user's workspace document id
	 */
	public createNewPagePost = async (page_post: PageConfigType, workspaceID: string) => {
		let admin_long_lived_token;
		let page_token;
		let post_published;

		// get workspace admin longLivedToken
		try {
			admin_long_lived_token = await firestore.getLongLivedToken(workspaceID);
		} catch (error) {
			console.log("🚀 ~ file: facebook.ts:109 ~ FacebookController ~ createNewPagePost= ~ error", error);
			throw new Error("Couldn't fetch long lived token from firebase collection");
		}

		// get page token
		if (admin_long_lived_token) {
			try {
				page_token = await this.getPageToken(page_post.page_id, admin_long_lived_token);
			} catch (error) {
				console.log("🚀 ~ file: facebook.ts:137 ~ FacebookController ~ createNewPagePost= ~ error", error);
				throw new Error("Couldn't get page token");
			}
		}

		// check post type
		if (page_post.type === "text") {
			try {
				post_published = await this.createTextPost(page_post.message, page_token);
			} catch (error) {
				console.log("🚀 ~ file: facebook.ts:146 ~ FacebookController ~ createNewPagePost= ~ error", error);
			}
		}

		// if all ok
		return post_published;
	};

	/**
	 * In the case of text, post a new feed page post
	 * @param page_post Page config type
	 */
	private async createTextPost(message: string, page_token: string) {
		try {
			const res = await axios.post(
				`https://graph.facebook.com/v15.0/me/feed?message=${message}&fields=permalink_url,id&access_token=${page_token}`
			);

			return res.data as PostDataType;
		} catch (error: any) {
			console.log("🚀 ~ file: facebook.ts:131 ~ FacebookController ~ createTextPost ~ error", error);
			throw error.response.data;
		}
	}
}

export default FacebookController;
