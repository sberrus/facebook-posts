import { scheduler } from "../app";
import { ScheduleConfigType } from "../types/jobs";

export const isValidType = (value: string) => {
	const validTypes = ["text", "img", "video"];
	if (!validTypes.includes(value)) {
		throw new Error(`type ${value} is not valid`);
	}
	return true;
};

export const checkScheduleConfig = ({ day, time }: ScheduleConfigType) => {
	if (day > 6) {
		throw new Error("day field should be a number 0-6");
	}

	if (time?.hour) {
		if (time.hour > 23) {
			throw new Error("time.hour data should be a number between 0-23");
		}
	}

	if (time?.minute) {
		if (time.minute > 59) {
			throw new Error("time.minute data should be a number between 0-59");
		}
	}

	return true;
};

export const checkIfJobExists = (value: string) => {
	const jobFound = scheduler.jobExists(value);

	if (!jobFound) {
		throw new Error(`Job with id ${value} does not exists`);
	}

	return true;
};
