// imports
import bodyParser from "body-parser";
import express, { Application } from "express";
import scheduleRouter from "../routes/schedule.routes";
import testRouter from "../routes/test.routes";
import tokenRouter from "../routes/token.routes";

class Server {
	// properties
	private app: Application;
	private port: string;

	// api paths
	private apiPaths = {
		schedule: "/api/schedule",
		token: "/api/token",
		test: "/api/test",
	};

	constructor() {
		this.app = express();
		this.port = process.env.PORT || "8080";

		// init middlewares
		this.middlewares();
		// init routes
		this.routes();
	}

	private middlewares() {
		this.app.use(bodyParser.json());
	}
	private routes() {
		this.app.use(this.apiPaths.schedule, scheduleRouter);
		this.app.use(this.apiPaths.token, tokenRouter);
		this.app.use(this.apiPaths.test, testRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("server running in port: " + this.port);
		});
	}
}

export default Server;
