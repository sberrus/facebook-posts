// imports
import * as dotenv from "dotenv";
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
const firebaseApp = new FirebaseApp();
export const app = firebaseApp.getApp();
// init bucket
export const bucket = new BucketController();
// init firestore
export const firestore = new FirestoreController();
// scheduler app
export const scheduler = new PostScheduler();
