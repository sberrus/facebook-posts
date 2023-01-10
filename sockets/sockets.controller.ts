import { Server, Socket } from "socket.io";

export const socketController = (socket: Socket, io: Server) => {
	// check auth

	// if auth not valid
	// socket.disconnect();
	console.log(socket.handshake.query);

	socket.on("connect", () => {
		console.log("user connected!");
	});
	socket.on("disconnect", () => {
		console.log("user offline");
	});
};
