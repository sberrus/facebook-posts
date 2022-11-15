// imports
import express, { Application } from "express";
import pingRouter from "../routes/ping.routes";

class Server {
	// properties
	private app: Application;
	private port: string;

	// api paths
	private apiPaths = {
		ping: "/api/ping",
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || "8080";

		// init routes
		this.routes();
	}

	private routes() {
		this.app.use(this.apiPaths.ping, pingRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("server running in port: " + this.port);
		});
	}
}

export default Server;
