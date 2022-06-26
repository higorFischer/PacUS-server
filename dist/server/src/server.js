"use strict";
// import * as express from "express";
// import * as http from "http";
// import * as WebSocket from "ws";
// import { board1 } from "../Boards/stringBoards";
// import { BoardBuilder } from "../Domain/Boards/Services/BoardBuilder";
// import { BoardMovementVerifier } from "../Domain/Boards/Services/BoardMovementVerifier";
// import { Player } from "../Domain/Players/Entities/Player";
// import { PlayerStatus } from "../Domain/Players/Enums/PlayerStatus";
// import { PlayerMover } from "../Domain/Players/Services/PlayerMover";
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
// //@ts-ignore
// wss.broadcast = function broadcast(msg) {
// 	wss.clients.forEach(function each(client) {
// 		client.send(msg);
// 	});
// };
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const rooms = { 0: [] };
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
    console.log("Connect", socket.id);
    rooms[0].push({ id: socket.id });
    socket.on('video', (video) => {
        const broadcastObj = { id: socket.id, video };
        io.emit("video", broadcastObj);
    });
    socket.on('disconnect', () => {
        console.log("Disconnect", socket.id);
    });
});
server.listen(8998, () => {
    console.log('GET');
});
//# sourceMappingURL=server.js.map