// imports
import { Facebook, FacebookApiException } from "fb";
import * as dotenv from "dotenv";
dotenv.config();

// secrets
const FB_APP_SECRET = process.env.FB_APP_SECRET;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

const fb = new Facebook({
	appId: "929198114717885",
	appSecret: FB_APP_SECRET,
	autoLogAppEvents: true,
	xfbml: true,
	version: "v15.0",
});

// FIRST REQUIRE PAGE ID WITH ROUTE "/me/accounts"
// SECOND GET THE PAGE TOKEN AND USE IT TO CREATE THE POSTS.

const getPageAccessToken = () => {
	fb.setAccessToken(FB_ACCESS_TOKEN);
	return new Promise((resolve, reject) => {
		fb.api(`/me/accounts`, "get", (res: any) => {
			if (!res || res.error) {
				console.log("\n\n----- ERROR ------\n\n");
				console.log("error ocurrered:", res);
				reject(res.error);
			}
			resolve(res);
		});
	});
};

const createPagePost = (id: string, access_token: string, message: string) => {
	return new Promise((resolve, reject) => {
		fb.setAccessToken(access_token);
		fb.api(`/${id}/feed`, "post", { message }, (res: any) => {
			if (!res || res.error) {
				console.log("\n\n----- ERROR ------\n\n");
				console.log("error ocurrered:", res);
				reject(res.error);
			}
			resolve(res);
		});
	});
};

export { getPageAccessToken, createPagePost };
