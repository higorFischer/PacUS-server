"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const stringBoards_1 = require("../Boards/stringBoards");
const BoardBuilder_1 = require("../Domain/Boards/Services/BoardBuilder");
const BoardMovementVerifier_1 = require("../Domain/Boards/Services/BoardMovementVerifier");
const Player_1 = require("../Domain/Players/Entities/Player");
const PlayerStatus_1 = require("../Domain/Players/Enums/PlayerStatus");
const PlayerMover_1 = require("../Domain/Players/Services/PlayerMover");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const board = BoardBuilder_1.BoardBuilder.create(stringBoards_1.board1);
const players = [];
var playerMover = new PlayerMover_1.PlayerMover();
wss.on("connection", (ws) => {
    ws.on("close", function close(c) {
        console.log("disconnected", c);
    });
    ws.on("message", (msg) => {
        var message = JSON.parse(msg);
        if (!message.self)
            return;
        var player = players.find((p) => p.UUID === message.self.UUID);
        if (player) {
            var newPosition = playerMover.moveByKey(player, message.key);
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
            //@ts-ignore
            wss.broadcast(v);
        }
    });
    var newPlayer = Player_1.Player.create(1, 1);
    //@ts-ignore
    newPlayer.UUID = wss.getUniqueID();
    players.push(newPlayer);
    const v = JSON.stringify({
        board,
        players,
        self: newPlayer,
    });
    ws.send(v);
});
//start our server
server.listen(process.env.PORT || 8998, () => {
    console.log(`Server started on port ${8998} :)`);
});
//@ts-ignore
wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4();
};
//@ts-ignore
wss.broadcast = function broadcast(msg) {
    wss.clients.forEach(function each(client) {
        client.send(msg);
    });
};
//# sourceMappingURL=server.js.map