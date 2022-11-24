import { Request, Response } from "express";
import { createPagePost, getPageAccessToken } from "../helpers/facebookPosts";

export const createPost = async (req: Request, res: Response) => {
	const message = req.body["message"];

	try {
		const fbRes: any = await getPageAccessToken();

		const { access_token, id } = fbRes.data[0];

		const pageCreationResponse = await createPagePost(id, access_token, message);

		res.json({
			ok: true,
			pageCreationResponse,
		});
	} catch (error) {
		res.json({ ok: false, error });
	}
};
