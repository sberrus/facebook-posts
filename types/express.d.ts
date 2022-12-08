import { DecodedIdToken } from "firebase-admin/auth";

export {};

interface FirebaseUser {
	uid: string;
	email: string;
}

declare global {
	namespace Express {
		export interface Request {
			firebaseUser?: DecodedIdToken;
		}
	}
}
