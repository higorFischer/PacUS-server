"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Entity_1 = require("../../Commons/Entity");
const Position_1 = require("../../Commons/Position");
const PlayerStatus_1 = require("../Enums/PlayerStatus");
class Player extends Entity_1.Entity {
    constructor(x, y) {
        super();
        this.points = 0;
        this.status = PlayerStatus_1.PlayerStatus.NORMAL;
        this.position = Position_1.Position.create(x, y);
    }
    static create(x, y) {
        return new Player(x, y);
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map