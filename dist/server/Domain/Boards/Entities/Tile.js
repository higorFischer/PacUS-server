"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const TileStatus_1 = require("../Enums/TileStatus");
class Tile {
    constructor(tile, position) {
        this.status = this.chooseType(tile);
        this.position = position;
    }
    chooseType(tile) {
        if (tile === "|")
            return TileStatus_1.TileStatus.BLOCKED;
        if (tile === "*")
            return TileStatus_1.TileStatus.POWERUP;
        if (tile === ".")
            return TileStatus_1.TileStatus.POINTOBJECT;
        return TileStatus_1.TileStatus.EMPTY;
    }
}
exports.Tile = Tile;
//# sourceMappingURL=Tile.js.map