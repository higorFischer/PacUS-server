"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMover = void 0;
const Position_1 = require("../../Commons/Position");
const Direction_1 = require("../Enums/Direction");
class PlayerMover {
    move(player, direction) {
        var newPosition = Position_1.Position.clone(player.position);
        switch (direction) {
            case Direction_1.Direction.DOWN:
                newPosition.y = player.position.y + 1;
                break;
            case Direction_1.Direction.UP:
                newPosition.y = player.position.y - 1;
                break;
            case Direction_1.Direction.RIGHT:
                newPosition.x = player.position.x + 1;
                break;
            case Direction_1.Direction.LEFT:
                newPosition.x = player.position.x - 1;
                break;
            default:
                break;
        }
        return newPosition;
    }
    moveByKey(player, key) {
        return this.move(player, this.keysToDirection(key));
    }
    keysToDirection(key) {
        switch (key) {
            case "ArrowRight":
                return Direction_1.Direction.RIGHT;
            case "ArrowLeft":
                return Direction_1.Direction.LEFT;
            case "ArrowUp":
                return Direction_1.Direction.UP;
            case "ArrowDown":
                return Direction_1.Direction.DOWN;
        }
        return Direction_1.Direction.STILL;
    }
}
exports.PlayerMover = PlayerMover;
//# sourceMappingURL=PlayerMover.js.map