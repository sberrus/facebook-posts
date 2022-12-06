// import
import { firestore } from "../app";
import axios from "axios";
// types
import { PostRequestBodyType } from "../types/jobs";

export const createNewPagePost = async (facebookPostBody: PostRequestBodyType) => {
	// Long lived token
	let LLT: string;
	// Get facebook sharing groups id's
	const sharingGroupsIds = facebookPostBody.sharing_groups_ids;
	// Get facebook page id
	const pageId = facebookPostBody.page_id;
	// Get new post permalink url
	let postPermalink: string;
	// Get facebook page token
	let pageToken;

	// Get Long lived token
	try {
		LLT = await firestore.getLongLivedToken(facebookPostBody.owner);
	} catch (error) {
		console.log("🚀 ~ file: facebookPosts.ts:12 ~ createNewPagePost ~ error", error);
		throw error;
	}

	// Get facebook page token
	try {
		const axPageResponse = await axios.get(
			`https://graph.facebook.com/v15.0/me/accounts?fields=id,access_token&access_token=${LLT}`
		);

		const { data } = axPageResponse.data;
		const page = data.find((page: any) => page.id === pageId);
		pageToken = page.access_token;
	} catch (error: any) {
		console.log("🚀 ~ file: facebookPosts.ts:13 ~ createNewPagePost ~ error", error.response.data);
		throw error.response.data;
	}

	/** TEXT CASE */
	if (facebookPostBody.type === "text") {
		const message = facebookPostBody.message;
		// Create Facebook page post
		try {
			const fbPostRes = await axios.post(
				`https://graph.facebook.com/v15.0/${pageId}/feed?message=${message}&fields=permalink_url&access_token=${pageToken}`
			);

			const postData = fbPostRes.data;

			// save post permalink_url
			postPermalink = postData.permalink_url;
		} catch (error: any) {
			console.log("🚀 ~ file: facebookPosts.ts:43 ~ createNewPagePost ~ error", error);
			throw error.response.data;
		}
		// Share page post in groups
		sharingGroupsIds.map(async (gruop_id) => {
			await axios.post(
				`https://graph.facebook.com/v15.0/${gruop_id}/feed?link=${postPermalink}&access_token=${LLT}`
			);
		});
	}

	/** IMAGE CASE */
};
