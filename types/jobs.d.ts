// imports
import schedule from "node-schedule";
import { GroupType } from "./workspace";

// sharing groups model
export interface GroupConfigType {
	group: GroupType;
	schedule: ScheduleConfigType;
}

// post groups model
export interface PageConfigType {
	page_id: string;
	message: string;
	type: "text" | "img" | "video";
	emotion?: string;
	asset_src?: string;
	location?: string;
	job_status?: "programmed" | "draft" | "trash";
	schedule_config?: ScheduleConfigType;
}

// post model
export interface PostDataType {
	title: string;
	page_post: PageConfigType;
	sharing_groups: GroupConfigType[];
}

// schedule config model
export interface ScheduleConfigType {
	date: string;
	hour: string;
	minute: string;
}

export interface JobType {
	workspace: string;
	id: string;
	job: schedule.Job;
}

// post published data
export interface PostPublishedType {
	id: string;
	permalink_url: string;
}
