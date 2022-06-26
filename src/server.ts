import { board1 } from "../Boards/stringBoards";
import { BoardBuilder } from "../Domain/Boards/Services/BoardBuilder";
import { BoardMovementVerifier } from "../Domain/Boards/Services/BoardMovementVerifier";
import { Player } from "../Domain/Players/Entities/Player";
import { PlayerStatus } from "../Domain/Players/Enums/PlayerStatus";
import { PlayerMover } from "../Domain/Players/Services/PlayerMover";
import { Position } from "../Domain/Commons/Position";

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

let board = BoardBuilder.create(board1);
let players = [] as Player[];
var playerMover = new PlayerMover();

app.get("/", (req: any, res: any) => {
	res.send("Hello");
});

io.on("connection", (socket: any) => {
	console.log("CONNECTED", socket.id);
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
		const index = players.findIndex((player) => player.UUID === socket.id);
		players.splice(index, 1);
		io.emit("disconnected", socket.id);
	});
});

server.listen(process.env.PORT || 3001, () => {
	console.log("listen to", process.env.PORT || 3001);
});

// const server = createSocket("udp4");

// server.on("error", (err) => {
// 	console.log(`server error:\n${err.stack}`);
// 	server.close();
// });

// server.on("message", (msg, rinfo) => {
// 	console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
// });

// server.on("listening", () => {
// 	const address = server.address();
// 	console.log(`server listening ${address.address}:${address.port}`);
// });

// server.bind(41234);
