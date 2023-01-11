import { Server, Socket } from "socket.io";
import { auth, firestore } from "../app";

class SocketController {
	private server: Server;

	constructor(server: Server) {
		this.server = server;

		// connection listener
		this.handleConnection();
	}

	/**
	 * Handle all incoming connection with the server
	 */
	handleConnection() {
		this.server.on("connection", (socket) => {
			this.checkUserAndAssignRoom(socket);
		});
	}

	async checkUserAndAssignRoom(socket: Socket) {
		// check socket.io auth object
		const firebaseToken = socket.handshake.auth["x-auth-token"];

		try {
			// check user auth
			const user = await auth.checkAuthToken(firebaseToken);
			if (user) {
				// get workspace
				const workspace = await firestore.getUserWorkspaceReference(user.uid);
				if (workspace) {
					// join socket to workspace room
					socket.join(workspace.id);
					socket.emit("room_assigned");
				}

				return;
			}

			// disconnect socket if error or not user
			socket.disconnect();
			console.log("user auth not valid, disconnecting socket");
		} catch (error) {
			console.log(error);
			socket.disconnect();
		}
	}
}

export default SocketController;
