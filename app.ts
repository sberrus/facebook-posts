// imports
import * as dotenv from "dotenv";
import AuthController from "./models/auth";
import BucketController from "./models/bucket";
import FacebookController from "./models/facebook";
import FirebaseApp from "./models/firebase";
dotenv.config();
import FirestoreController from "./models/firestore";
import Scheduler from "./models/scheduler";
import Server from "./models/server";
import SocketController from "./models/sockets";

// server
const server = new Server();
server.listen();
// initialize Firebase app
export const firebaseApp = new FirebaseApp();
// init bucket
export const bucket = new BucketController();
// init firestore
export const firestore = new FirestoreController();
// init auth
export const auth = new AuthController();
// init facebook
export const facebook = new FacebookController();
// scheduler app
export const scheduler = new Scheduler();
// socket controller
export const sockets = new SocketController(server.io);
