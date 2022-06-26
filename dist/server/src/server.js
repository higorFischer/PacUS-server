"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringBoards_1 = require("../Boards/stringBoards");
const BoardBuilder_1 = require("../Domain/Boards/Services/BoardBuilder");
const BoardMovementVerifier_1 = require("../Domain/Boards/Services/BoardMovementVerifier");
const Player_1 = require("../Domain/Players/Entities/Player");
const PlayerStatus_1 = require("../Domain/Players/Enums/PlayerStatus");
const PlayerMover_1 = require("../Domain/Players/Services/PlayerMover");
const Position_1 = require("../Domain/Commons/Position");
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
let board = BoardBuilder_1.BoardBuilder.create(stringBoards_1.board1);
let players = [];
var playerMover = new PlayerMover_1.PlayerMover();
app.get("/", (req, res) => {
    res.send("Hello");
});
io.on("connection", (socket) => {
    console.log("CONNECTED", socket.id);
    socket.on("reset", () => {
        board = BoardBuilder_1.BoardBuilder.create(stringBoards_1.board1);
        players = players.map((player) => (Object.assign(Object.assign({}, player), { position: Position_1.Position.create(1, 1), status: PlayerStatus_1.PlayerStatus.NORMAL })));
        const v = JSON.stringify({
            board,
            players,
        });
        io.emit("gameaction", v);
    });
    socket.on("game", () => {
        var newPlayer = Player_1.Player.create(1, 1);
        newPlayer.UUID = socket.id;
        players.push(newPlayer);
        const v = JSON.stringify({
            board,
            players,
            self: newPlayer,
        });
        io.emit("gameaction", v);
    });
    socket.on("video", (video) => {
        const broadcastObj = { id: socket.id, video };
        io.emit("video", broadcastObj);
    });
    socket.on("movement", (msg) => {
        var direction = JSON.parse(msg);
        var player = players.find((p) => p.UUID === socket.id);
        if (player) {
            var newPosition = playerMover.moveByKey(player, direction.key);
            var movement = BoardMovementVerifier_1.BoardMovementVerifier.verify(board, newPosition);
            if (movement.canMove) {
                player.position = newPosition;
                if (movement.points && movement.points > 0)
                    player.points += movement.points;
                if (movement.isPowerUp)
                    player.status = PlayerStatus_1.PlayerStatus.GODMODE;
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
//# sourceMappingURL=server.js.map