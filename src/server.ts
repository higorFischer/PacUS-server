import { board1 } from "../Boards/stringBoards";
import { BoardBuilder } from "../Domain/Boards/Services/BoardBuilder";
import { BoardMovementVerifier } from "../Domain/Boards/Services/BoardMovementVerifier";
import { Player } from "../Domain/Players/Entities/Player";
import { PlayerStatus } from "../Domain/Players/Enums/PlayerStatus";
import { PlayerMover } from "../Domain/Players/Services/PlayerMover";

import { Direction } from "../Domain/Players/Enums/Direction";
import { Position } from "../Domain/Commons/Position";

// const app = express();
// const server = http.createServer(app);

// const wss = new WebSocket.Server({ server });

// const board = BoardBuilder.create(board1);
// const players = [] as Player[];
// var playerMover = new PlayerMover();

// wss.on("connection", (ws: WebSocket) => {
// 	console.log("Connected: trws")

// 	ws.on("close", function close(c) {
// 		console.log("disconnected", c);
// 	});

// 	ws.on("message", (msg: any) => {
// 		var message = JSON.parse(msg);
// 		if (!message.self) return;
// 		var player = players.find((p) => p.UUID === message.self.UUID)!;

// 		if (player) {
// 			var newPosition = playerMover.moveByKey(player, message.key);
// 			var movement = BoardMovementVerifier.verify(board, newPosition);

// 			if (movement.canMove) {
// 				player.position = newPosition;

// 				if (movement.points && movement.points > 0)
// 					player.points += movement.points;

// 				if (movement.isPowerUp) player.status = PlayerStatus.GODMODE;
// 			}

// 			const v = JSON.stringify({
// 				board,
// 				players,
// 			});

// 			//@ts-ignore
// 			wss.broadcast(v);
// 		}
// 	});

// 	var newPlayer = Player.create(1, 1);
// 	//@ts-ignore
// 	newPlayer.UUID = wss.getUniqueID();
// 	players.push(newPlayer);

// 	const v = JSON.stringify({
// 		board,
// 		players,
// 		self: newPlayer,
// 	});

// 	ws.send(v);
// });

// //start our server
// server.listen(process.env.PORT || 8998, () => {
// 	console.log(`Server started on port ${8998} :)`);
// });

// //@ts-ignore
// wss.getUniqueID = function () {
// 	function s4() {
// 		return Math.floor((1 + Math.random()) * 0x10000)
// 			.toString(16)
// 			.substring(1);
// 	}
// 	return s4() + s4() + "-" + s4();
// };
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: "*",
	},
});

const rooms = { 0: [] as any[] };
let board = BoardBuilder.create(board1);
let players = [] as Player[];
var playerMover = new PlayerMover();

app.get("/", (req: any, res: any) => {
	res.send("Hello");
});

io.on("connection", (socket: any) => {
	socket.on("reset", () => {
		board = BoardBuilder.create(board1);
		players = players.map((player) => ({
			...player,
			position: Position.create(1, 1),
			status: PlayerStatus.NORMAL,
		}));

		const v = JSON.stringify({
			board,
			players,
		});

		io.emit("gameaction", v);
	});

	socket.on("game", () => {
		var newPlayer = Player.create(1, 1);
		newPlayer.UUID = socket.id;
		players.push(newPlayer);

		const v = JSON.stringify({
			board,
			players,
			self: newPlayer,
		});
		io.emit("gameaction", v);
	});

	socket.on("video", (video: any) => {
		const broadcastObj = { id: socket.id, video };
		io.emit("video", broadcastObj);
	});

	socket.on("movement", (msg: any) => {
		var direction = JSON.parse(msg);
		var player = players.find((p) => p.UUID === socket.id)!;

		if (player) {
			var newPosition = playerMover.moveByKey(player, direction.key);
			var movement = BoardMovementVerifier.verify(board, newPosition);

			if (movement.canMove) {
				player.position = newPosition;

				if (movement.points && movement.points > 0)
					player.points += movement.points;

				if (movement.isPowerUp) player.status = PlayerStatus.GODMODE;
			}

			const v = JSON.stringify({
				board,
				players,
			});

			io.emit("gameaction", v);
		}
	});

	socket.on("disconnect", () => {
		console.log("Disconnect", socket.id);
	});
});

server.listen(process.env.PORT || 3001, () => {
	console.log("GET");
});
