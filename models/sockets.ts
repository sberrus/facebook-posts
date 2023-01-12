import { Server, Socket } from "socket.io";
import { auth, firestore } from "../app";
import { ShareGroupEventType } from "../types/sockets";

class SocketController {
	// socket io server
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

	/**
	 * Assign a socket to its workspace room
	 * @param socket socket connected
	 * @returns
	 */
	async checkUserAndAssignRoom(socket: Socket) {
		// check socket.io auth object
		const firebaseToken = socket.handshake.auth["x-auth-token"];

		try {
			// check user auth
			const user = await auth.checkAuthToken(firebaseToken);

			// handle error
			if (!user) {
				// disconnect socket if error or not user
				socket.disconnect(true);
				console.log("user auth not valid, disconnecting socket");
			}

			// join socket to workspace room
			if (user) {
				// get workspace
				const workspace = await firestore.getUserWorkspaceReference(user.uid);

				// join socket
				if (workspace) {
					socket.join(workspace.id);
				}
			}
		} catch (error) {
			console.log(error);
			socket.disconnect();
		}
	}

	/**
	 * Emit event to python script that handles the external group sharing process.
	 * @param workspaceID workspace id necessary to emit the event to an specific room.
	 * @param eventData data necesary to process the sharing group process.
	 */
	emitShareGroupsEvent(workspaceID: string, eventData: ShareGroupEventType) {
		this.server.to(workspaceID).emit("share_in_groups", eventData);
	}
}

export default SocketController;
