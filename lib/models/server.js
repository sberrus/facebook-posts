"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// imports
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const schedule_routes_1 = __importDefault(require("../routes/schedule.routes"));
const token_routes_1 = __importDefault(require("../routes/token.routes"));
class Server {
    constructor() {
        // api paths
        this.apiPaths = {
            schedule: "/api/schedule",
            token: "/api/token",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "8080";
        // init middlewares
        this.middlewares();
        // init routes
        this.routes();
    }
    middlewares() {
        this.app.use(body_parser_1.default.json());
    }
    routes() {
        this.app.use(this.apiPaths.schedule, schedule_routes_1.default);
        this.app.use(this.apiPaths.token, token_routes_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("server running in port: " + this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map