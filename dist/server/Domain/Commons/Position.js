"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static create(x, y) {
        return new Position(x, y);
    }
    static clone(position) {
        return new Position(position.x, position.y);
    }
}
exports.Position = Position;
//# sourceMappingURL=Position.js.map