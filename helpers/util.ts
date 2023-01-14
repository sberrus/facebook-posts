/**
 * Script execution will wait the quantity of seconds given.
 * @param secs seconds that the execution will sleep
 * @returns
 */
export const sleep = async (secs: number) => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res(null);
		}, secs * 1000);
	});
};
