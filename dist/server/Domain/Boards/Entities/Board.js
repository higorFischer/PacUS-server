"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const Entity_1 = require("../../Commons/Entity");
const TileStatus_1 = require("../Enums/TileStatus");
class Board extends Entity_1.Entity {
    constructor(tiles) {
        super();
        this.tiles = tiles;
    }
    get flattenTiles() {
        return this.tiles.flatMap((c) => c);
    }
    get xLimit() {
        return this.tiles.length;
    }
    get yLimit() {
        return this.tiles[0].length;
    }
    fetch(position) {
        return this.tiles[position.x][position.y];
    }
    isInsideHorizontaly(position) {
        return position.x < this.xLimit && position.x >= 0;
    }
    isInsideVerticaly(position) {
        return position.y < this.yLimit && position.y >= 0;
    }
    isInside(position) {
        return (this.isInsideHorizontaly(position) &&
            this.isInsideVerticaly(position));
    }
    isPointObject(position) {
        return this.fetch(position).status === TileStatus_1.TileStatus.POINTOBJECT;
    }
    isPowerUP(position) {
        return this.fetch(position).status === TileStatus_1.TileStatus.POWERUP;
    }
}
exports.Board = Board;
//# sourceMappingURL=Board.js.map