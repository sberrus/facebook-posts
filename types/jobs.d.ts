// imports
import schedule from "node-schedule";
// https://developers.facebook.com/docs/graph-api/reference/v15.0/page/feed

export interface ScheduleConfigType {
	day: number;
	time?: {
		hour?: number;
		minute?: number;
	};
}
// request body
export interface PostRequestBodyType {
	title: string;
	message: string;
	type: "text" | "img" | "video";
	url?: string;
	emotion?: string;
	asset_src?: string;
	location?: string;
	schedule_config?: ScheduleConfigType;
	job_status?: "programmed" | "draft" | "trash";
}

export interface JobType {
	id: string;
	job: schedule.Job;
}
