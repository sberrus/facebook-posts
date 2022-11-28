// imports
import schedule from "node-schedule";
// https://developers.facebook.com/docs/graph-api/reference/v15.0/page/feed
// facebook post type
export interface FacebookPostType {
	message: string;
	type: "text" | "img" | "video";
	url?: string;
	emotion?: string;
	asset_src?: string;
	location?: string;
}

export interface JobType {
	id: string;
	job: schedule.Job;
}
