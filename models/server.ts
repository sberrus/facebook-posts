// imports
import bodyParser from "body-parser";
import express, { Application } from "express";
import facebookRouter from "../routes/facebook.routes";

class Server {
	// properties
	private app: Application;
	private port: string;

	// api paths
	private apiPaths = {
		ping: "/api/facebook",
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
		this.app.use(this.apiPaths.ping, facebookRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("server running in port: " + this.port);
		});
	}
}

export default Server;
