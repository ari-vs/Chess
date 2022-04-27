class Piece {
    constructor(row, col, type, player) {
        this.row = row;
        this.col = col;
        this.type = type;
        this.player = player;
    }

    //returns the possible moves of a selected piece
    getPossibleMoves() {
        let relativeMoves;
        //checks the piece type to get its relative to itself moves
        if (this.type === PAWN) {
            relativeMoves = this.getPawnRelativeMoves();
        } else if (this.type === ROOK) {
            relativeMoves = this.getRookRelativeMoves();
        } else if (this.type === KNIGHT) {
            relativeMoves = this.getKnightRelativeMoves();
        } else if (this.type === BISHOP) {
            relativeMoves = this.getBishopRelativeMoves();
        } else if (this.type === KING) {
            relativeMoves = this.getKingRelativeMoves();
        } else if (this.type === QUEEN) {
            relativeMoves = this.getQueenRelativeMoves();
        }

        let absoluteMoves = [];
        //converts the relative moves to absolute moves on the board
        for (let relativeMove of relativeMoves) {
            const absoluteRow = this.row + relativeMove[0];
            const absoluteCol = this.col + relativeMove[1];
            absoluteMoves.push([absoluteRow, absoluteCol]);
        }

        let filteredMoves = [];
        //filters moves that are not on the board and that are blocked by allied pieces
        for (let absoluteMove of absoluteMoves) {
            const absoluteRow = absoluteMove[0];
            const absoluteCol = absoluteMove[1];
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                if (dataBoard.checkCell(pieces, absoluteRow, absoluteCol) == undefined) {
                    filteredMoves.push(absoluteMove);
                } else if (this.player !== dataBoard.checkPlayer(pieces, absoluteRow, absoluteCol)) {
                    filteredMoves.push(absoluteMove);
                }
            }
        }
        return filteredMoves;
    }

    getPawnRelativeMoves() {
        let result = [];
        if (this.player == 'white') {
            if (dataBoard.checkCell(pieces, this.row + 1, this.col) == undefined) {
                result.push([1, 0]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row + 1, this.col + 1) && dataBoard.checkPlayer(pieces, this.row + 1, this.col + 1) !== undefined) {
                result.push([1, 1]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row + 1, this.col - 1) !== undefined) {
                result.push([1, -1]);
            }
        } else if (this.player == 'black') {
            if (dataBoard.checkCell(pieces, this.row - 1, this.col) == undefined) {
                result.push([-1, 0]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row - 1, this.col + 1) && dataBoard.checkPlayer(pieces, this.row - 1, this.col + 1) !== undefined) {
                result.push([-1, 1]);
            }
            if (this.player !== dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) && dataBoard.checkPlayer(pieces, this.row - 1, this.col - 1) !== undefined) {
                result.push([-1, - 1]);
            }
        }
        return result;
    }

    getRookRelativeMoves() {
        let result = [];
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row + i, this.col) !== undefined) {
                result.push([i, 0]);
                break;
            }
            result.push([i, 0]);
        }
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row - i, this.col) !== undefined) {
                result.push([-i, 0]);
                break;
            }
            result.push([-i, 0]);
        }
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row, this.col + i) !== undefined) {
                result.push([0, i]);
                break;
            }
            result.push([0, i]);
        } for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row, this.col - i) !== undefined) {
                result.push([0, -i]);
                break;
            }
            result.push([0, -i]);
        }
        return result;
    }

    getKnightRelativeMoves() {
        let result = [];
        result.push([2, 1]);
        result.push([2, -1]);
        result.push([1, 2]);
        result.push([-1, 2]);
        result.push([-2, 1]);
        result.push([-2, -1]);
        result.push([1, -2]);
        result.push([-1, -2]);
        return result;
    }

    getKingRelativeMoves() {
        let result = [];
        result.push([0, -1]);
        result.push([0, 1]);
        result.push([1, 0]);
        result.push([-1, 0]);
        result.push([1, 1]);
        result.push([-1, -1]);
        result.push([1, -1]);
        result.push([-1, 1]);
        return result;
    }

    getBishopRelativeMoves() {
        let result = [];
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row + i, this.col + i) !== undefined) {
                result.push([i, i]);
                break;
            }
            result.push([i, i]);
        }
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row - i, this.col - i) !== undefined) {
                result.push([-i, -i]);
                break;
            }
            result.push([-i, -i]);
        }
        for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row + i, this.col - i) !== undefined) {
                result.push([i, -i]);
                break;
            }
            result.push([i, -i]);
        } for (let i = 1; i < 8; i++) {
            if (dataBoard.checkCell(pieces, this.row - i, this.col + i) !== undefined) {
                result.push([-i, i]);
                break;
            }
            result.push([-i, i]);
        }
        return result;
    }

    getQueenRelativeMoves() {
        return this.getRookRelativeMoves().concat(this.getBishopRelativeMoves());
    }
}