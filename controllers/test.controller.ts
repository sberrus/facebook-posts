import { Request, Response } from "express";
import { sockets } from "../app";

export const test = async (req: Request, res: Response) => {
	// user token data
	try {
		sockets.emitShareGroupsEvent("dcNJh12kj7Ul9AKOTqxn", {
			page_post: {
				permalink_url: "lhttps://www.facebook.com/117293011200170/posts/134109996185138alelo",
			},
			groups: [
				{
					name: "Grupo de prueba",
					id: "708497023977873",
					schedule: {
						date: "6",
						hour: "15",
						minute: "00",
					},
					picture: {
						data: {
							url: "https://scontent.fmad10-1.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=8xGzOxvhHdEAX9oInr4&_nc_ht=scontent.fmad10-1.fna&edm=AB3eOjgEAAAA&oh=00_AfCY4_ddOLZgtRpHd10HTaOfcTRS-M5XkEfmd0RnXwTJYA&oe=63EA1143",
							width: 50,
							height: 50,
							is_silhouette: true,
						},
					},
					job_id: "b280f6dd-ddae-4eee-9a21-cb362f9a39b4",
				},
				{
					schedule: {
						minute: "00",
						hour: "15",
						date: "6",
					},
					name: "Grupo de prueba",
					picture: {
						data: {
							width: 50,
							url: "https://scontent.fmad10-1.fna.fbcdn.net/v/t1.30497-1/116687302_959241714549285_318408173653384421_n.jpg?stp=cp0_dst-jpg_p50x50&_nc_cat=1&ccb=1-7&_nc_sid=0c64ff&_nc_ohc=8xGzOxvhHdEAX9oInr4&_nc_ht=scontent.fmad10-1.fna&edm=AB3eOjgEAAAA&oh=00_AfCY4_ddOLZgtRpHd10HTaOfcTRS-M5XkEfmd0RnXwTJYA&oe=63EA1143",
							is_silhouette: true,
							height: 50,
						},
					},
					id: "708497023977873",
					job_id: "5222212b-a646-4c5a-97a0-e602848dd64f",
				},
			],
		});
	} catch (error) {
		console.log(error);
	}

	res.json({ ok: true });
};
