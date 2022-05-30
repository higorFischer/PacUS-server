"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardBuilder = void 0;
const Position_1 = require("../../Commons/Position");
const Board_1 = require("../Entities/Board");
const Tile_1 = require("../Entities/Tile");
class BoardBuilder {
    static create(matrix) {
        var newTiles = [];
        for (var rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
            var newRow = [];
            var row = matrix[rowIndex];
            for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
                var column = row[columnIndex];
                newRow.push(new Tile_1.Tile(column, Position_1.Position.create(rowIndex, columnIndex)));
            }
            newTiles.push(newRow);
        }
        return new Board_1.Board(newTiles);
    }
}
exports.BoardBuilder = BoardBuilder;
//# sourceMappingURL=BoardBuilder.js.map