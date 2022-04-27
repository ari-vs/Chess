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
let currentPlayer = 'white';
let winner;

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
  let cPieceRow = currentPiece[0];
  let cPieceCol = currentPiece[1];
  piecePlayer = dataBoard.getPiece(cPieceRow, cPieceCol).player
  if ((currentPlayer == dataBoard.getPiece(row, col).player) || (currentPlayer == piecePlayer)) {
    if (event.currentTarget.classList.contains("movement")) {
      moveCurrentPiece(cPieceRow, cPieceCol, row, col);
      if (currentPlayer === 'white'){
        currentPlayer = 'black';
      }else if(currentPlayer === 'black'){
        currentPlayer = 'white';
      }
    }
  }else{
    alert("this is "+currentPlayer+"'s turn!");
  }
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('selected', 'movement');
    }
  }
  if(winner==undefined){
  let movingPiece = dataBoard.getPiece(row, col);
  console.log('this cell is occupied by', movingPiece);
  for (let piece of pieces) {
    if (piece.row === row && piece.col === col && (piece.row !== currentPiece[0] && piece.col !== currentPiece[1])) {
      possibleMoves = piece.getPossibleMoves();
      for (let possibleMove of possibleMoves) {
        table.rows[possibleMove[0]].cells[possibleMove[1]].classList.add('movement');
      }
    }
  }
}else{
  alert(winner+" wins!")
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
      if (piece.player !== dataBoard.checkPlayer(pieces, row, col) && dataBoard.checkPlayer(pieces, row, col) !== undefined) {
        let eatenPiece = dataBoard.getPiece(row, col);
        if(eatenPiece.type === KING){
          winner = currentPlayer;
        }
        indexOfEaten = pieces.indexOf(eatenPiece);
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
dataBoard = new BoardData(pieces);
window.addEventListener('load', createChessBoard);