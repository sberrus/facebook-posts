import { PostScopeGroupJobType } from "./jobs";

interface ShareGroupEventType {
	page_post: {
		permalink_url: string;
	};
	groups: PostScopeGroupJobType[];
}
