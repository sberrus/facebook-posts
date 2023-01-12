// imports
import axios from "axios";
import { firestore, sockets } from "../app";

// type
import { FacebookPageResponseType } from "../types/index";
import { PageConfigType, PostScopeType, PostPublishedType } from "../types/jobs";
import { ShareGroupEventType } from "../types/sockets";
import { ExternalGroupType, GroupType } from "../types/workspace";
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
			console.log("🚀 ~ file: facebook.ts:97 ~ FacebookController ~ getPageToken ~ error", error.response.data);

			throw new Error("Facebook Error: Couldn`t get page token");
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
	public createNewPagePost = async (page_post: PageConfigType, workspaceID: string, post_scope_id: string) => {
		let page_token;
		let post_published;

		try {
			// get job_scope_page
			const jobScope = await firestore.getJobScope(post_scope_id);

			// check if job is still running
			if (jobScope.post_scope_status) {
				// get workspace admin longLivedToken
				const admin_long_lived_token = await firestore.getWorkspaceLongLivedToken(workspaceID);

				// get page token
				if (admin_long_lived_token) {
					page_token = await this.getPageToken(page_post.page_id, admin_long_lived_token);
				}

				// check post type
				if (page_post.type === "text") {
					post_published = await this.createTextPost(page_post.message, page_token);
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: facebook.ts:142 ~ FacebookController ~ createNewPagePost= ~ error", error);
			throw new Error("Facebook Error: Couldn`t create new page post");
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

			return res.data as PostPublishedType;
		} catch (error: any) {
			console.log("🚀 ~ file: facebook.ts:131 ~ FacebookController ~ createTextPost ~ error", error.response.data);
			throw new Error("Facebook Error: Fail creating new Text Post");
		}
	}

	/**
	 * Share in specified group owned by admin the last post page published in
	 * post scope
	 */
	public async shareLastPostInOwnGroups(post_scope_id: string, groupID: string) {
		try {
			// get post_scope reference
			const postScopeReference = await firestore.getPostScopeReference(post_scope_id);
			const { last_post_published, workspaceID, post_scope_status } = postScopeReference.data() as PostScopeType;

			// check if there is any post published
			if (!last_post_published) {
				console.log("there is any post published yet!");
				return;
			}
			if (post_scope_status) {
				//  publish the last post in given group
				const longLivedToken = await firestore.getWorkspaceLongLivedToken(workspaceID);

				//
				if (longLivedToken && last_post_published) {
					return await axios.post(
						`https://graph.facebook.com/v15.0/${groupID}/feed?link=${last_post_published.permalink_url}&access_token=${longLivedToken}`
					);
				}
			}
		} catch (error) {
			console.log("🚀 ~ file: facebook.ts:171 ~ FacebookController ~ shareLastPostInGroups ~ error", error);
			throw new Error("Facebook Error: Couldn't share the last post published in group");
		}
	}

	public async externalGroupIsValid(userID: string, groupID: string) {
		try {
			// get long lived token
			const workspace = await firestore.getUserWorkspace(userID);

			// check external group
			if (workspace?.longLivedToken) {
				const res = await axios.get(
					`https://graph.facebook.com/v15.0/${groupID}?fields=name,id,picture&access_token=${workspace.longLivedToken}`
				);
				return res.data as ExternalGroupType;
			}
		} catch (error: any) {
			console.log(error.response.data);
			throw "Facebook error: group not found!";
		}
	}

	/**
	 * Given the post_scope, emit event to python script via socket to share the page post in external group.
	 * @param post_scope_id
	 */
	public async shareLastPostInExternalGroups(post_scope_id: string) {
		try {
			// get post_scope reference
			const postScopeReference = await firestore.getPostScopeReference(post_scope_id);
			const { last_post_published, workspaceID, post_scope_status, groups } =
				postScopeReference.data() as PostScopeType;

			// check if there is any post published
			if (!last_post_published) {
				console.log("there is any post published yet!");
				return;
			}

			if (post_scope_status) {
				// get data for python script
				let eventData: ShareGroupEventType = {
					page_post: {
						permalink_url: last_post_published.permalink_url,
					},
					groups: groups.external,
				};
				// emit event.
				sockets.emitShareGroupsEvent(workspaceID, eventData);
			}
		} catch (error) {
			console.log("🚀 ~ file: facebook.ts:171 ~ FacebookController ~ shareLastPostInGroups ~ error", error);
			throw new Error("Facebook Error: Couldn't share the last post published in group");
		}
	}
}

export default FacebookController;
