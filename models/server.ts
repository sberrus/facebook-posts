// imports
import bodyParser from "body-parser";
import express, { Application } from "express";
import cors from "cors";
// routes
import scheduleRouter from "../routes/schedule.routes";
import assetsRouter from "../routes/assets.routes";
import tokenRouter from "../routes/token.routes";
import workspaceRouter from "../routes/workspace.routes";
import groupsRouter from "../routes/groups.routes";
import { checkFirebaseUserToken } from "../middlewares/auth.middleware";

class Server {
	// properties
	private app: Application;
	private port: string;

	// api paths
	private apiPaths = {
		schedule: "/api/schedule",
		token: "/api/token",
		assets: "/api/assets",
		workspace: "/api/workspace",
		groups: "/api/groups",
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
		this.app.use(cors());
		this.app.use(checkFirebaseUserToken);
	}
	private routes() {
		this.app.use(this.apiPaths.schedule, scheduleRouter);
		this.app.use(this.apiPaths.token, tokenRouter);
		this.app.use(this.apiPaths.assets, assetsRouter);
		this.app.use(this.apiPaths.workspace, workspaceRouter);
		this.app.use(this.apiPaths.groups, groupsRouter);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("server running in port: " + this.port);
		});
	}
}

export default Server;
