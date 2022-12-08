export {};

interface FirebaseUser {
	uid: string;
}

declare global {
	namespace Express {
		export interface Request {
			firebaseUser?: FirebaseUser;
		}
	}
}
