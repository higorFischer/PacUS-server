"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardMovementVerifier = void 0;
const TileStatus_1 = require("../Enums/TileStatus");
class BoardMovementVerifier {
    static verify(board, newPosition) {
        if (board.fetch(newPosition).status === TileStatus_1.TileStatus.BLOCKED)
            return { canMove: false };
        if (!board.isInside(newPosition))
            return { canMove: false };
        if (board.isPointObject(newPosition)) {
            board.fetch(newPosition).status = TileStatus_1.TileStatus.EMPTY;
            return { canMove: true, points: 100 };
        }
        if (board.isPowerUP(newPosition)) {
            board.fetch(newPosition).status = TileStatus_1.TileStatus.EMPTY;
            return { canMove: true, isPowerUp: true };
        }
        return { canMove: true };
    }
}
exports.BoardMovementVerifier = BoardMovementVerifier;
//# sourceMappingURL=BoardMovementVerifier.js.map