// imports
import schedule from "node-schedule";

export interface ScheduleConfigType {
	day: number;
	time?: {
		hour?: number;
		minute?: number;
	};
}
// request body
export interface PostRequestBodyType {
	owner: string;
	page_id: string;
	title: string;
	message: string;
	type: "text" | "img" | "video";
	sharing_groups_ids: string[];
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
