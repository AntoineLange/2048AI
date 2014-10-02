// 37 gauche
// 38 haut
// 39 droite
// 40 bas

//Fonction jouant aléatoirement sauf bas
function randomPlay() {
	var eventObj = $.Event('keydown');
	var key = Math.floor(Math.random() * 4) + 36;
	eventObj.keyCode = key;
	eventObj.which = key;
	$("#board-container").trigger(eventObj);
}

//Fonction effectuant un mouvement haut ou droite
function topOrRight() {
	var eventObj = $.Event('keydown');
	var key = Math.floor(Math.random() * 2) + 38;
	eventObj.keyCode = key;
	eventObj.which = key;
	$("#board-container").trigger(eventObj);
}

function AISimple() {
	var totalTop = 0;
	var totalRight = 0;
	var totalBottom = 0;
	var totalLeft = 0;

	$('.tile').sort(function(a, b) {
		return parseInt($(a).html()) > parseInt($(b).html()) ? 1 : 1;
	//Pour toute les cases
	}).each(function() {
		//On récupère la valeur de la case
		var currentCol = parseInt($(this).attr('data-col'));
		var currentRow = parseInt($(this).attr('data-row'));
		var value = parseInt($(this).html());
		positionTab = new Array();
		positionTab = scan('#board-container', currentCol, currentRow, value);
		result = new Array();
		for(var i = 0; i <= 3; i++) {
			if(positionTab[i][1] == true) {
				switch(i) {
					case 0:
						totalTop += positionTab[i][0];
					break;
					case 1:
						totalRight += positionTab[i][0];
					break;
					case 2:
						totalBottom += positionTab[i][0];
					break;
					case 3:
						totalLeft += positionTab[i][0];
					break;
				}
			}
		}
	});

	var bestScoreMove = Math.max(totalTop, totalRight, totalBottom, totalLeft);
	//alert('totalTop ' + totalTop + '\ntotalLeft ' + totalLeft + '\ntotalRight ' + totalRight + '\ntotalBottom ' + totalBottom + '\nbestScoreMove ' + bestScoreMove);
	var somethingMoved = false;
	switch(bestScoreMove) {
		case 0:
			randomPlay();
		break;
		case totalTop:
			somethingMoved = move(false, 'top');
		break;
		case totalRight:
			somethingMoved = move(false, 'right');
		break;
		case totalLeft:
			somethingMoved = move(false, 'left');
		break;
		case totalBottom:
			somethingMoved = move(false, 'bottom');
		break;
	}
	//Si on a eu un mouvement
	if(somethingMoved) {
		//On ajoute une case "2"
		newTwo();
		colorTiles();
	}
	//On regarde si un mouvement est possible
	var gameOver = canMoveFn();
	if(!gameOver) {
		gameOverFn();
	}
}


//Fonction du bouton AI Simple
function AI() {
	var totalTop = 0;
	var totalRight = 0;
	var totalBottom = 0;
	var totalLeft = 0;

	var maxTile = 0;
	var currentColMaxTile = 0;
	var currentRowMaxTile = 0;

	$('#board-container .tile').each(function() {
		//On récupère la valeur de la case
		var currentCol = parseInt($(this).attr('data-col'));
		var currentRow = parseInt($(this).attr('data-row'));
		var value = parseInt($(this).html());
		if(value > maxTile) {
			maxTile = value;
			currentColMaxTile = currentCol;
			currentRowMaxTile = currentRow;
		}
		positionTab = new Array();
		//On récupère le score de chaque mouvement possible de notre case
		positionTab = scan('#board-container', currentCol, currentRow, value);
		result = new Array();
		//On additionne les scores de chaque cases
		for(var i = 0; i <= 3; i++) {
			if(positionTab[i][1] == true) {
				switch(i) {
					case 0:
						if(currentRowMaxTile == 0 && currentColMaxTile == 3) {
							topOrRight();
						}
						totalTop += positionTab[i][0];
					break;
					case 1:
						totalRight += positionTab[i][0];
					break;
					case 2:
						totalBottom += positionTab[i][0];
					break;
					case 3:
						totalLeft += positionTab[i][0];
					break;
				}
			}
		}
	});

	//console.log('PAS CLONE : \ntop : ' + totalTop + '\n right : ' + totalRight + '\n bottom : ' + totalBottom + ' \n left : ' + totalLeft);

	bestMoveCloneTop = new Array();
	$("#board-container").clone().attr('id', 'board-containerClone').insertAfter("#board-container");
	move(true, 'top');
	bestMoveCloneTop = bestMovement('#board-containerClone', 'top');
	totalTop = totalTop + bestMoveCloneTop[1];
	$("#board-containerClone").remove();


	bestMoveCloneRight = new Array();
	$("#board-container").clone().attr('id', 'board-containerClone').insertAfter("#board-container");
	move(true, 'right');
	bestMoveCloneRight = bestMovement('#board-containerClone', 'right');
	totalRight = totalRight + bestMoveCloneRight[1];
	$("#board-containerClone").remove();

	bestMoveCloneLeft = new Array();
	$("#board-container").clone().attr('id', 'board-containerClone').insertAfter("#board-container");
	move(true, 'left');
	bestMoveCloneLeft = bestMovement('#board-containerClone', 'left');
	totalLeft = totalLeft + bestMoveCloneLeft[1];
	$("#board-containerClone").remove();


	bestMoveCloneBottom = new Array();
	$("#board-container").clone().attr('id', 'board-containerClone').insertAfter("#board-container");
	move(true, 'bottom');
	bestMoveCloneBottom = bestMovement('#board-containerClone', 'bottom');
	totalBottom = totalBottom + bestMoveCloneBottom[1];
	$("#board-containerClone").remove();
	

	var bestScoreMove = Math.max(totalTop, totalRight, totalBottom, totalLeft);
	//console.log('ADDITION DES DEUX : \ntotalTop ' + totalTop + '\ntotalLeft ' + totalLeft + '\ntotalRight ' + totalRight + '\ntotalBottom ' + totalBottom + '\nbestScoreMove ' + bestScoreMove);
	
	var somethingMoved = false;
	switch(bestScoreMove) {
		case totalTop:
			somethingMoved = move(false, 'top');
			if(!somethingMoved && (totalTop == totalRight)) {
				somethingMoved = move(false, 'right');
				if(!somethingMoved && (totalRight == totalLeft)) {
					somethingMoved = move(false, 'left');
					if(!somethingMoved && (totalLeft == totalBottom)) {
						somethingMoved = move(false, 'bottom');
					}
				}
			}
		break;
		case totalRight:
			somethingMoved = move(false, 'right');
			if(!somethingMoved && (totalRight == totalLeft)) {
				somethingMoved = move(false, 'left');
				if(!somethingMoved && (totalLeft == totalBottom)) {
					somethingMoved = move(false, 'bottom');
				}
			}
		break;
		case totalLeft:
			somethingMoved = move(false, 'left');
			if(!somethingMoved && (totalLeft == totalBottom)) {
				somethingMoved = move(false, 'bottom');
			}
		break;
		case totalBottom:
			somethingMoved = move(false, 'bottom');
		break;
	}
	//Si on a eu un mouvement
	if(somethingMoved) {
		//On ajoute une case "2"
		newTwo();
		colorTiles();
	}
	//On regarde si un mouvement est possible
	var gameOver = canMoveFn();
	console.log(gameOver);
	if(!gameOver) {
		gameOverFn();
	}
}

//Retourne le meilleur mouvement possible pour le plateau de jeu cloné
function bestMovement(idBoard, afterMove) {
	var totalTop = 0;
	var totalRight = 0;
	var totalBottom = 0;
	var totalLeft = 0;

	$(idBoard + ' .tile').each(function() {
		//On récupère la valeur de la case
		var currentCol = parseInt($(this).attr('data-col'));
		var currentRow = parseInt($(this).attr('data-row'));

		var value = parseInt($(this).html());
		positionTab = new Array();
		//On récupère le score de chaque mouvement possible de notre case
		positionTab = scan(idBoard, currentCol, currentRow, value);

		//On additionne les scores de chaque cases
		for(var i = 0; i <= 3; i++) {
			if(positionTab[i][1] == true) {
				/*$(this).addClass('tile-test');
				alert('row ' + currentRow + 'col ' + currentCol);
				alert('score de la tile après move ' + afterMove + '\n top' + positionTab[0][0] + '\n right' + positionTab[1][0] + '\nbottom ' + positionTab[2][0] + '\nleft ' + positionTab[3][0]);
				$(this).removeClass('tile-test');*/
				switch(i) {
					case 0:
						totalTop += positionTab[i][0];
					break;
					case 1:
						totalRight += positionTab[i][0];
					break;
					case 2:
						totalBottom += positionTab[i][0];
					break;
					case 3:
						totalLeft += positionTab[i][0];
					break;
				}
			}
		}
	});

	//On trouve le mouvement qui a le meilleur score
	var bestScoreMove = Math.max(totalTop, totalRight, totalBottom, totalLeft);
	console.log('CLONE après move ' + afterMove +' : \ntotalTop ' + totalTop + '\ntotalLeft ' + totalLeft + '\ntotalRight ' + totalRight + '\ntotalBottom ' + totalBottom + '\nbestScoreMove ' + bestScoreMove);
	//alert('top : ' + totalTop + '\n right : ' + totalRight + '\n bottom : ' + totalBottom + ' \n left : ' + totalLeft);
	result = new Array();
	switch(bestScoreMove) {
		case 0:
			result.push('aucun');
			result.push(0);
		break;
		case totalTop:
			result.push('top');
			result.push(totalTop);
		break;
		case totalRight:
			result.push('right');
			result.push(totalRight);
		break;
		case totalLeft:
			result.push('left');
			result.push(totalLeft);
		break;
		case totalBottom:
			result.push('bottom');
			result.push(totalBottom);
		break;
	}
	return result;
}

//Retourne pour une case, le meilleur score de chaque mouvement
function scan(idBoard, currentCol, currentRow, value) {
	var topPos = 0;
	var rightPos = 0;
	var bottomPos = 0;
	var leftPos = 0;

	var topMove = false;
	var rightMove = false;
	var bottomMove = false;
	var leftMove = false;

	switch(currentCol) {
		case 0:
			switch(currentRow) {
				case 0: 
					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
				break;
				case 1:
					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));

					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
				break;
				case 2:
					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));

					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
				break;
				case 3:
					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));

					if(rightPos == value) { rightMove = true; }
					if(topPos == value) { topMove = true; }
				break;
			}
			
		break;
		
		case 1:
			switch(currentRow) {
				case 0:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 1:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));

					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 2:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 3:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
			}
		
		break;

		case 2:
			switch(currentRow) {
				case 0:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));
					
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 1:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 2:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 3:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					rightPos = returnValue(idBoard, (currentCol + 1), currentRow);
					rightPos = scanNextTile(idBoard, 'right', rightPos, (currentCol + 1), currentRow);

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(rightPos == value) { rightMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
			}
		
		break;

		case 3:
			switch(currentRow) {
				case 0:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));
					
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				
				case 1:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 2:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					bottomPos = returnValue(idBoard, currentCol, (currentRow + 1));
					bottomPos = scanNextTile(idBoard, 'bottom', bottomPos, currentCol, (currentRow + 1));

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));
					
					if(topPos == value) { topMove = true; }
					if(bottomPos == value) { bottomMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
				case 3:
					leftPos = returnValue(idBoard, (currentCol - 1), currentRow);
					leftPos = scanNextTile(idBoard, 'left', leftPos, (currentCol - 1), currentRow);

					topPos = returnValue(idBoard, currentCol, (currentRow - 1));
					topPos = scanNextTile(idBoard, 'top', topPos, currentCol, (currentRow - 1));

					if(topPos == value) { topMove = true; }
					if(leftPos == value) { leftMove = true; }
				break;
			}
			
		break;
	}

	/*if(isNaN(topPos)) {
		topPos = 0;
	}
	if(isNaN(rightPos)) {
		rightPos = 0;
	}
	if(isNaN(bottomPos)) {
		bottomPos = 0;
	}
	if(isNaN(leftPos)) {
		leftPos = 0;
	}*/

	var topTab = new Array();
	topTab.push(topPos, topMove);

	var rightTab = new Array();
	rightTab.push(rightPos, rightMove);

	var bottomTab = new Array();
	bottomTab.push(bottomPos, bottomMove);

	var leftTab = new Array();
	leftTab.push(leftPos, leftMove);

	var positions = new Array();
	positions.push(topTab, rightTab, bottomTab, leftTab);

	return positions;
}


//Retourne la valeur d'une case
function returnValue(idBoard, col, row) {
	return parseInt($(idBoard + ' .tile[data-col=' + col + '][data-row=' + row + ']').html());
}

//Lorsque qu'une case est vide, on vient scanner la case d'après
function scanNextTile(idBoard, movement, pos, col, row) {
	if(isNaN(pos)) {
		switch(movement) {
			case 'top':
				var newPos = returnValue(idBoard, col, row - 1);
				if((row > 0) && (row < 3)) {
					newPos = scanNextTile(idBoard, movement, newPos, col, (row - 1));
				}
			break;
			case 'right':
				var newPos = returnValue(idBoard, col + 1, row );
				if((col > 0) && (col < 3)) {
					newPos = scanNextTile(idBoard, movement, newPos, (col + 1), row);
				}
			break;
			case 'bottom':
				var newPos = returnValue(idBoard, col, row + 1);
				if((row > 0) && (row < 3)) {
					newPos = scanNextTile(idBoard, movement, newPos, col, (row + 1));
				}
			break;
			case 'left':
				var newPos = returnValue(idBoard, col - 1, row);
				if((col > 0) && (col < 3)) {
					newPos = scanNextTile(idBoard, movement, newPos, (col - 1), row);
				}
			break;
		}
		return newPos;
	} else {
		return pos;
	}
}

//Fonction ajoutant une case "2" ou "4" aléatoirement sur le jeu cloné
function newTwoClone() {
	//On compte le nombre de case vide
	var emptyTiles = $('#board-containerClone .empty-tile').length;
	//On multiplie ce nombre par un nombre entre 0 et 1, puis on l'arrondie à l'entier inférieur
	var randomTwo = Math.floor(Math.random()*emptyTiles);
	//On identifie la case vide
	var tile = $('#board-containerClone .empty-tile').eq(randomTwo);
	//On change la classe de la case
	$(tile).removeClass('empty-tile').addClass('full-tile');
	//On récupère sa position
	var tilePosition = $(tile).position();

	//On créé une chiffre 2 ou 4
	var newTile = Math.random() < 0.9 ? 2 : 4;

	//On l'ajoute sur le jeu
	$('#board-containerClone').append('<div id="lastaddedClone" class="tile" data-row="' + $(tile).attr('data-row') + '" data-col="' + $(tile).attr('data-col') + '">' + newTile + '</div>');
	$('#lastaddedClone').css({top:(tilePosition.top + 8) + 'px', left:(tilePosition.left + 8) + 'px'});
	$('#lastaddedClone').fadeTo(animationSpeed*2, 1, function() {
		canMove = true;
	})
	$('#lastaddedClone').attr('id', '');
}