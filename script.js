// 0 = empty
// 1 = white flat
// 2 = black flat
// 3 = white wall
// 4 = black wall
// 5 = white capstone
// 6 = black capstone
let turn = 1;
let moveList = [];
let whiteCapstone = false;
let blackCapstone = false;
let board = [
	0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0
];
/*let board = [
	1211212, 0, 0, 2, 0, 0,
	2, 14, 2, 13, 0, 0,
	0, 6, 12, 1, 0, 0,
	0, 211, 25, 1, 0, 0,
	12123, 0, 0, 2, 0, 0,
	2, 14, 2, 2113, 0, 0,
];*/
setup();

function renderBoard(board) {
	for (let i = 0; i < board.length; i++) {
		let square = document.getElementById("square" + (i + 1));
		let stack = board[i].toString().split('').map(Number);

		while (square.firstChild) {
			square.removeChild(square.firstChild);
		};
		for (let k = 0; k < stack.length; k++) {


			stone = document.createElement("div");
			switch (stack[k]) {
				case 1:
					stone.className = "flat whiteFlat";
					break;

				case 2:
					stone.className = "flat blackFlat";
					break;

				case 3:
					stone.className = "wall whiteWall";
					break;

				case 4:
					stone.className = "wall blackWall";
					break;

				case 5:
					stone.className = "capstone whiteCapstone";
					break;

				case 6:
					stone.className = "capstone blackCapstone";
					break;
			}
			square.appendChild(stone);
			if (stone.classList.contains("wall")) {
				stone.style.transform = "translateY(" + ((k * -8) + "px") + ") rotate(45deg)";
			} else {
				stone.style.transform = "translateY(" + ((k * -8) + "px") + ")";
			}
		}
	}
}


function placeStone(position, type, ptn) {
	if (board[position - 1] != 0) {
		illegalMove("occupied");
		return;
	}

	if (type == "capstone") {
		if (turn == 1) {
			if (whiteCapstone == true) {
				illegalMove("capstone limit");
				return;
			}
			whiteCapstone = true;
		}
		if (turn == 2) {
			if (blackCapstone == true) {
				illegalMove("capstone limit");
				return;
			}
			blackCapstone = true;
		}
	}

	if (type == "wall") {
		board[position - 1] = (turn + 2);
	} else if (type == "capstone") {
		board[position - 1] = (turn + 4);
		console.log("capstone placed");
	} else if (type == "flat") {
		board[position - 1] = turn;
	}
	renderBoard(board);
	moveList.push(ptn);
	renderMoveList(moveList);
	switchTurn();
}

function moveStack(movement, ptn) {
	const boardSize = 6;
	const maxPickup = 6;

	let position = coordToPosition(movement.square);
	let originalStack = board[position - 1].toString().split('').map(Number);
	let workingBoard = [...board]; // copy of board to test on

	// check max pickup limit
	if (movement.count > maxPickup) {
		illegalMove("carry limit");
		return;
	}

	// check if stack has enough stones
	if (originalStack.length < movement.count) {
		illegalMove("stone deficit");
		return;
	}

	// pick up stones
	let pickedUp = originalStack.slice(-movement.count);
	let tempStack = originalStack.slice(0, -movement.count);
	workingBoard[position - 1] = tempStack.length ? Number(tempStack.join('')) : 0;

	// simulate drops
	let newPosition = position;
	for (let i = 0; i < movement.drops.length; i++) {
		newPosition = movePosition(newPosition, movement.direction, boardSize);
		if (newPosition === null) {
			illegalMove("out of bounds");
			return;
		}

		let dropCount = movement.drops[i];
		let toDrop = pickedUp.splice(0, dropCount);
		let destStack = workingBoard[newPosition - 1].toString().split('').map(Number);
		let topDest = destStack[destStack.length - 1];

		// can't drop on capstones
		if (topDest === 5 || topDest === 6) {
			illegalMove("capstone");
			return;
		}

		// flatten wall with capstone
		if (topDest === 3 || topDest === 4) {
			let firstDrop = toDrop[0];
			if (firstDrop === 5 || firstDrop === 6) {
				destStack[destStack.length - 1] = (topDest === 3) ? 1 : 2; // replace wall
			} else {
				illegalMove("wall");
				return;
			}
		}

		// drop stones
		destStack = destStack.concat(toDrop);
		workingBoard[newPosition - 1] = Number(destStack.join(''));
	}

	// move is legal, apply it to the real board
	board = workingBoard;
	renderBoard(board);
	moveList.push(ptn);
	renderMoveList(moveList);
	switchTurn();
}




function movePosition(position, dir, boardSize) {
	let row = Math.floor((position - 1) / boardSize);
	let col = (position - 1) % boardSize;

	switch (dir) {
		case '+': row -= 1; break;
		case '-': row += 1; break;
		case '>': col += 1; break;
		case '<': col -= 1; break;
	}

	if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
		return null;
	}

	return row * boardSize + col + 1;
}

function switchTurn() {
	turnIndicator = document.getElementById("turnIndicator");
	if (turn == 1) {
		turn = 2;
		turnIndicator.innerHTML = "Black's Turn";
		turnIndicator.style.backgroundColor = "black";
		turnIndicator.style.color = "white";
	} else if (turn == 2) {
		turn = 1;
		turnIndicator.innerHTML = "White's Turn";
		turnIndicator.style.backgroundColor = "white";
		turnIndicator.style.color = "black";
	}
}

function playMove() {
	let moveInput = document.getElementById("moveInput"); // move input
	let ptn = moveInput.value.trim();
	moveInput.value = "";

	// handle placement
	if (!/^\d/.test(ptn) && !/[+\-<>]/.test(ptn)) {
		console.log("is placement");
		if (/^[S]/.test(ptn)) { // walls
			placeStone(coordToPosition(ptn.slice(1)), "wall", ptn);
		} else if (/^[C]/.test(ptn)) { // capstone
			placeStone(coordToPosition(ptn.slice(1)), "capstone", ptn);
		} else { // flat
			placeStone(coordToPosition(ptn), "flat", ptn);
		}
		return;
	}

	// handle moevment
	console.log("is movement");
	const match = ptn.match(/^(\d?)([a-h][1-8])([+\-<>])(\d*)$/i);

	if (!match) {
		illegalMove("invalid");
		return;
	}

	const [_, countStr, square, direction, dropsStr] = match;

	let stackStr = board[coordToPosition(square) - 1].toString();
	let topStone = parseInt(stackStr.slice(-1));

	if (((topStone % 2) + 1) == turn) {
		illegalMove("color");
		return;
	}


	// if no count is given, it's 1
	const count = countStr === "" ? 1 : parseInt(countStr, 10);

	// if no drops are specified
	let drops;
	if (dropsStr === "") {
		if (count === 1) {
			drops = [1]; // shorthand: a1+ means 1a1+1
		} else {
			illegalMove("invalid");
			return;
		}
	} else {
		drops = dropsStr.split('').map(Number);

		const totalDropped = drops.reduce((a, b) => a + b, 0);
		if (totalDropped !== count) {
			illegalMove("invalid");
			return;
		}
	}

	// perform the move
	moveStack({
		count,
		square: square.toLowerCase(),
		direction,
		drops
	}, ptn);

	console.log({
		count,
		square: square.toLowerCase(),
		direction,
		drops
	});
}


function coordToPosition(coord) {
	const colLetter = coord[0];
	const rowNumber = parseInt(coord.slice(1), 10);

	const colIndex = colLetter.charCodeAt(0) - 'a'.charCodeAt(0);
	const rowIndex = 6 - rowNumber;

	return rowIndex * 6 + colIndex + 1;
}

function illegalMove(type) {
	let illegalMessage;

	switch (type) {
		case ("invalid"):
			illegalMessage = "Invalid move, refer to the PTN Guide if you're unsure.";
			break;
		case ("occupied"):
			illegalMessage = "You can't place a stone on an occupied square.";
			break;
		case ("out of bounds"):
			illegalMessage = "You can't spread a stack off out of bounds.";
			break;
		case ("wall"):
			illegalMessage = "You can't drop stones onto a wall.";
			break;
		case ("carry limit"):
			illegalMessage = "You can't pick up more than 6 stones from a stack.";
			break;
		case ("stone deficit"):
			illegalMessage = "There are not enough stones to pick up.";
			break;
		case ("capstone"):
			illegalMessage = "You can't drop stones onto a capstone.";
			break;
		case ("color"):
			illegalMessage = "You can't move a stack that your opponent controls.";
			break;
		case ("capstone limit"):
			illegalMessage = "You can only place 1 capstone per game.";
			break;
	}

	alert(illegalMessage);
}

function renderMoveList(moves) {
	let moveListContainer = document.getElementById("moveList");
	let currentMove;

	// kill all children
	while (moveListContainer.firstChild) {
		moveListContainer.removeChild(moveListContainer.firstChild);
	};

	// add each move as a child
	for (let i = 0; i < moves.length; i++) {
		currentMove = document.createElement("div");
		if (i % 2 == 0) {
			currentMove.className = "move whiteMove";
		} else if (i % 2 == 1) {
			currentMove.className = "move blackMove";
		}
		currentMove.innerHTML = (i + 1) + ". " + moves[i];
		moveListContainer.appendChild(currentMove);
	}

	moveListContainer.scrollTop = moveListContainer.scrollHeight;
}

function setup() {
	board = [
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0
	];
	renderBoard(board);
	turn = 1;
	whiteCapstone = false;
	blackCapstone = false;
	turnIndicator.innerHTML = "White's Turn";
	turnIndicator.style.backgroundColor = "white";
	turnIndicator.style.color = "black";
	moveList = [];
	renderMoveList(moveList);
}