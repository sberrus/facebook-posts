// imports
import * as dotenv from "dotenv";
import AuthController from "./models/auth";
import BucketController from "./models/bucket";
import FirebaseApp from "./models/firebase";
dotenv.config();
import FirestoreController from "./models/firestore";
import PostScheduler from "./models/scheduler";
import Server from "./models/server";

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
// scheduler app
export const scheduler = new PostScheduler();
