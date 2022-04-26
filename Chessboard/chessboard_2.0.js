const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';

const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';

let selectedCell;
let pieces = [];
let dataBoard;
let possibleMove;
let possibleMoves;
let currentPiece = [];

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }
  getPossibleMoves() {
    let relativeMoves;
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
    console.log('relativeMoves', relativeMoves);

    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1];
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    console.log('absoluteMoves', absoluteMoves);

    let filteredMoves = [];
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
    console.log('filteredMoves', filteredMoves);
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

class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  getPiece(row, col) {
    let gPiece;
    for (let piece of this.pieces) {
      if (piece.row == row && piece.col == col) {
        gPiece = piece;
      }
    }
    if (gPiece == undefined) {
      gPiece = "nothing";
    }
    return gPiece;
  }

  checkCell(pieces, row, col) {
    for (let piece of pieces) {
      if (piece.row == row && piece.col == col) {
        return piece;
      }
    }
  }

  checkPlayer(pieces, row, col) {
    for (let piece of pieces) {
      if (piece.row == row && piece.col == col) {
        return piece.player;
      }
    }
  }
}
function getInitialBoard() {
  let result = [];
  addPieces(result, 0, WHITE_PLAYER);
  addPieces(result, 7, BLACK_PLAYER);

  for (let i = 0; i < BOARD_SIZE; i++) {
    result.push(new Piece(1, i, PAWN, WHITE_PLAYER));
    result.push(new Piece(6, i, PAWN, BLACK_PLAYER));
  }
  return result;
}

function addPieces(result, row, player) {
  result.push(new Piece(row, 0, ROOK, player));
  result.push(new Piece(row, 1, KNIGHT, player));
  result.push(new Piece(row, 2, BISHOP, player));
  result.push(new Piece(row, 3, KING, player));
  result.push(new Piece(row, 4, QUEEN, player));
  result.push(new Piece(row, 5, BISHOP, player));
  result.push(new Piece(row, 6, KNIGHT, player));
  result.push(new Piece(row, 7, ROOK, player));
}

function addImage(cell, player, name) {
  const image = document.createElement('img');
  image.src = 'images/' + player + '/' + name + '.png';
  cell.appendChild(image);
}

function onCellClick(event, row, col, table) {
  console.log(row);
  console.log(col);
  if (event.currentTarget.classList.contains("movement")) {
    console.log(currentPiece);
    cPieceRow = currentPiece[0];
    cPieceCol = currentPiece[1];
    moveCurrentPiece(cPieceRow, cPieceCol, row, col);
  }
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('selected', 'movement');
    }
  }
  let movingPiece = dataBoard.getPiece(row, col);
  console.log('this cell is occupied by', movingPiece);
  for (let piece of pieces) {
    if (piece.row === row && piece.col === col) {
      possibleMoves = piece.getPossibleMoves();
      for (let possibleMove of possibleMoves) {
        table.rows[possibleMove[0]].cells[possibleMove[1]].classList.add('movement');
      }
    }
  }
  selectedCell = event.currentTarget;
  selectedCell.classList.add('selected');
  currentPiece = [row, col];
}

function createChessBoard() {
  const table = document.createElement('table');
  document.body.appendChild(table);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      cell.setAttribute('id', 'cell-' + row + '_' + col);
      if ((row + col) % 2 === 0) {
        cell.className = 'light-cell';
      } else {
        cell.className = 'dark-cell';
      }
      cell.addEventListener('click', (event) => onCellClick(event, row, col, table));
    }
  }

  for (let piece of pieces) {
    addImage(table.rows[piece.row].cells[piece.col], piece.player, piece.type);
  }
}

function moveCurrentPiece(cPieceRow, cPieceCol, row, col) {
  for (let piece of pieces) {
    if (piece.row === cPieceRow && piece.col === cPieceCol) {
      if(piece.player!==dataBoard.checkPlayer(pieces, row, col) && dataBoard.checkPlayer(pieces, row, col) !== undefined){
        let eatenPiece = dataBoard.getPiece(row, col);
        console.log(eatenPiece);
        indexOfEaten = pieces.indexOf(eatenPiece);
        console.log(indexOfEaten);
        pieces.splice(indexOfEaten, 1);
        document.getElementById('cell-' + row + '_' + col).firstElementChild.remove();
      }
      piece.row = row;
      piece.col = col;
      pieceImage = document.getElementById('cell-' + cPieceRow + '_' + cPieceCol).firstElementChild;
      document.getElementById('cell-' + cPieceRow + '_' + cPieceCol).firstElementChild.remove();
      document.getElementById('cell-' + row + '_' + col).appendChild(pieceImage)
    }
  }
}

pieces = getInitialBoard();
console.log('pieces', pieces);
dataBoard = new BoardData(pieces);
console.log('BoardData', dataBoard);
window.addEventListener('load', createChessBoard);