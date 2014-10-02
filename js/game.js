//Vitesse d'animation des tiles
var animationSpeed = 50;

var canMove = false;

$(document).ready(function() {
	addBestScore();
	//On appelle deux fois la fonction créant un Tile "2" pour débuter une partie
	newTwoStart();
	newTwoStart();
	//On change la couleur des cases
	colorTiles();
	var intervalRandom = null;
	var intervalAISimple = null;
	var intervalAI = null;
	//Bouton nouvelle partie
	$(".restart-button").on('click', function() {
		clearInterval(intervalRandom);
		clearInterval(intervalAI);
		//On supprime toutes les cases présentes
		$('.tile').remove();
		$('.board-tile').removeClass('full-tile').addClass('empty-tile');
		$('#gameOver').hide();
		newTwoStart();
		newTwoStart();
		colorTiles();
		scoreToZero();
	});

	//Bouton Random
	$(".random-button").on('click', function() {
		clearInterval(intervalAI);
		clearInterval(intervalAISimple);
		intervalRandom = setInterval(function() {
			randomPlay();
		}, 200);
	});

	//Bouton IA Clone
	$(".aiClone-button").on('click', function() {
		clearInterval(intervalRandom);
		clearInterval(intervalAISimple);
		intervalAI = setInterval(function() {
			AI();
		}, 1000);
	});

	//Bouton IA Simple
	$(".aiSimple-button").on('click', function() {
		clearInterval(intervalRandom);
		clearInterval(intervalAI);
		intervalAI = setInterval(function() {
			AISimple();
		}, 100);
	});
});

function move(clone, direction) {
	if(clone) {
		var idBoard = '#board-containerClone';
	} else {
		var idBoard = '#board-container';
	}
	var somethingMoved = false;
	switch(direction) {
		case 'left':
			$(idBoard + ' .tile').sort(function(a, b) {
				return $(a).attr('data-col') > $(b).attr('data-col') ? 1 : -1;
			//Pour chaque case
			}).each(function() {
				//On récupère sa position
				var currentCol = parseInt($(this).attr('data-col'));
				var currentRow = parseInt($(this).attr('data-row'));
				var destination = currentCol;

				$(this).attr('data-destroy', 0);
				//Si la case n'était pas dans la colonne de gauche, elle subit un déplacement
				if(currentCol > 0) {
					//On regarde les cases de gauche
					for(i = currentCol - 1; i >= 0; i--) {
						//Si la case à gauche est remplie
						if($(idBoard + ' .board-tile[data-col=' + i + '][data-row=' + currentRow + ']').hasClass('full-tile')) {
							//Si le contenu du la case est égal a celui de la case de gauche
							if($(this).html() == $(idBoard + ' .tile[data-col=' + i + '][data-row=' + currentRow + ']').html()) {
								//On prépare la destruction
								$(this).attr('data-destroy', 1);
								//On prépare la nouvelle destination
								destination = i;
							}
							//Si la case de gauche est remplie, mais qu'il n'y a pas la même valeur, on ne fait rien
							break;
						}
						//Si la case de gauche n'est pas remplie, on prépare la nouvelle destination de la case
						else {
							destination = i;
						}
					}
					//Si la case a bougée
					if(currentCol != destination) {
						somethingMoved = true;
					}
					$(this).animate({
						//on effectue le déplacement de 116 pixels multipliés par le nombre de déplacement à effectuer
						left: '-=' + (116 * (currentCol - destination))
					}, animationSpeed, function() {
						//Si on avait préparé la destruction
						if($(this).attr('data-destroy') == 1) {
							//Dans la nouvelle case, on ajoute l'ancienne multiplié par 2
							$(idBoard + ' .tile[data-col=' + destination + '][data-row=' + currentRow + ']').html(parseInt($(this).html()*2));
							//On supprime l'ancienne.
							$(this).remove();
							if(!clone) {
								colorTiles();
								updateScore(parseInt($(this).html()));
							}
						}
					});
					//On change la classe pleine par vide dans la case supprimée
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + currentRow + ']').removeClass('full-tile').addClass('empty-tile');
					//On change l'attribut numéro de colonne dans la nouvelle case
					$(this).attr('data-col', destination);
					//On change la classe vide par pleine dans la nouvelle case
					$(idBoard + ' .board-tile[data-col=' + destination + '][data-row=' + currentRow + ']').removeClass('empty-tile').addClass('full-tile');
				}
			});
		break;

		case 'right':
			$(idBoard + ' .tile').sort(function(a, b) {
				return $(a).attr('data-col') > $(b).attr('data-col') ? -1 : 1;
			}).each(function() {
				var currentCol = parseInt($(this).attr('data-col'));
				var currentRow = parseInt($(this).attr('data-row'));
				var destination = currentCol;
				$(this).attr('data-destroy', 0);
				if(currentCol < 3) {
					for(i = currentCol + 1; i <= 3; i++) {
						if($(idBoard + ' .board-tile[data-col=' + i + '][data-row=' + currentRow + ']').hasClass('full-tile')) {
							if($(this).html() == $(idBoard + ' .tile[data-col=' + i + '][data-row=' + currentRow + ']').html()) {
								$(this).attr('data-destroy', 1);
								destination = i;
							}
							break;
						}
						else {
							destination = i;
						}
					}
					if(currentCol != destination) {
						somethingMoved = true;
					}
					$(this).animate({
						left: '+=' + (116*(destination - currentCol))
					}, animationSpeed, function() {
						if($(this).attr('data-destroy') == 1) {
							$(idBoard + ' .tile[data-col=' + destination + '][data-row=' + currentRow + ']').html(parseInt($(this).html()*2));
							$(this).remove();
							if(!clone) {
								colorTiles();
								updateScore(parseInt($(this).html()));
							}
						}	
					});
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + currentRow + ']').removeClass('full-tile').addClass('empty-tile');
					$(this).attr('data-col', destination);
					$(idBoard + ' .board-tile[data-col=' + destination + '][data-row=' + currentRow + ']').removeClass('empty-tile').addClass('full-tile');
				}
			});
		break;
		case 'top':
			$(idBoard + ' .tile').sort(function(a, b) {
				return $(a).attr('data-row') > $(b).attr('data-row') ? 1 : -1;
			}).each(function() {
				var currentCol = parseInt($(this).attr('data-col'));
				var currentRow = parseInt($(this).attr('data-row'));
				var destination = currentRow;
				$(this).attr('data-destroy', 0);
				if(currentRow > 0) {
					for(i = currentRow - 1; i >= 0; i--) {
						if($(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + i + ']').hasClass('full-tile')) {
							if($(this).html() == $(idBoard + ' .tile[data-col=' + currentCol + '][data-row=' + i + ']').html()) {
								$(this).attr('data-destroy',1)
								destination = i;
							}
							break;
						}
						else {
							destination = i;
						}
					}
					if(destination != currentRow) {
						somethingMoved = true;
					}
					$(this).animate({
						top: '-=' + (116*(currentRow - destination))
					}, animationSpeed, function() {
						if($(this).attr('data-destroy') == 1) {
							$(idBoard + ' .tile[data-col=' + currentCol + '][data-row=' + destination + ']').html(parseInt($(this).html()*2));
							$(this).remove();
							if(!clone) {
								colorTiles();
								updateScore(parseInt($(this).html()));
							}
						}
					});
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + currentRow + ']').removeClass('full-tile').addClass('empty-tile');
					$(this).attr('data-row', destination);
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + destination + ']').removeClass('empty-tile').addClass('full-tile');
				}
			});
		break;
		case 'bottom':
			$(idBoard + ' .tile').sort(function(a, b) {
				return $(a).attr('data-row') > $(b).attr('data-row') ? -1 : 1;
			}).each(function() {
				var currentCol = parseInt($(this).attr('data-col'));
				var currentRow = parseInt($(this).attr('data-row'));
				var destination = currentRow;
				$(this).attr('data-destroy', 0);
				if(currentRow < 3) {
					for(i = currentRow + 1; i <= 3; i++) {
						if($(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + i + ']').hasClass('full-tile')) {
							if($(this).html() == $(idBoard + ' .tile[data-col=' + currentCol + '][data-row=' + i + ']').html()) {
								$(this).attr('data-destroy',1)
								destination = i;
							}
							break;
						}
						else {
							destination = i;
						}
					}
					if(destination != currentRow) {
						somethingMoved = true;
					}
					$(this).animate({
						top: '+=' + (116*(destination - currentRow))
					}, animationSpeed, function(){
						if($(this).attr('data-destroy') == 1) {
							$(idBoard + ' .tile[data-col=' + currentCol + '][data-row=' + destination + ']').html(parseInt($(this).html()*2));
							$(this).remove();
							if(!clone) {
								colorTiles();
								updateScore(parseInt($(this).html()));
							}
						}
					});
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + currentRow + ']').removeClass('full-tile').addClass('empty-tile');
					$(this).attr('data-row', destination);
					$(idBoard + ' .board-tile[data-col=' + currentCol + '][data-row=' + destination + ']').removeClass('empty-tile').addClass('full-tile');
				}
			});
		break;
	}
	return somethingMoved;
}

$(document).keydown(function(event) {
	if(canMove) {
		canMove = false; 
		var somethingMoved = false;
		//Selon la touche pressée :
		switch(event.keyCode) {
			//Flèche de gauche ou "q"
			case 37:
			case 81:
				somethingMoved = move(false, 'left');
				break;
			//Flèche de droite ou "d"
			case 39:
			case 68:
				somethingMoved = move(false, 'right');
				break;
			//Flèche du haut ou "z"
			case 38:
			case 90:
				somethingMoved = move(false, 'top');
				break;
			//Flèche du bas ou "s"
			case 40:
			case 83:
				somethingMoved = move(false, 'bottom');
				break;
		}
		//Si on a eu un mouvement
		if(somethingMoved) {
			//On ajoute une case "2"
			newTwo();
			colorTiles();
		} else {
			canMove = true;
		}
		//On regarde si un mouvement est possible
		var gameOver = canMoveFn();
		if(!gameOver) {
			gameOverFn();
		}
	}
});

//Fonction ajoutant une case "2" ou "4" aléatoirement sur le jeu
function newTwo() {
	//On compte le nombre de case vide
	var emptyTiles = $('.empty-tile').length;
	//On multiplie ce nombre par un nombre entre 0 et 1, puis on l'arrondie à l'entier inférieur
	var randomTwo = Math.floor(Math.random()*emptyTiles);
	//On identifie la case vide
	var tile = $('.empty-tile').eq(randomTwo);
	//On change la classe de la case
	$(tile).removeClass('empty-tile').addClass('full-tile');
	//On récupère sa position
	var tilePosition = $(tile).position();

	//On créé une chiffre 2 ou 4
	var newTile = Math.random() < 0.9 ? 2 : 4;

	//On l'ajoute sur le jeu
	$('#board-container').append('<div id="lastadded" class="tile" data-row="' + $(tile).attr('data-row') + '" data-col="' + $(tile).attr('data-col') + '">' + newTile + '</div>');
	$('#lastadded').css({top:(tilePosition.top + 8) + 'px', left:(tilePosition.left + 8) + 'px'});
	$('#lastadded').fadeTo(animationSpeed*2, 1, function() {
		canMove = true;
	})
	$('#lastadded').attr('id', '');
}

//Fonction ajoutant une case "2" aléatoirement sur le jeu pour le début de la partie
function newTwoStart() {
	//On compte le nombre de case vide
	var emptyTiles = $('.empty-tile').length;
	//On multiplie ce nombre par un nombre entre 0 et 1, puis on l'arrondie à l'entier inférieur
	var randomTwo = Math.floor(Math.random()*emptyTiles);
	//On identifie la case vide
	var tile = $('.empty-tile').eq(randomTwo);
	//On change la classe de la case
	$(tile).removeClass('empty-tile').addClass('full-tile');
	//On récupère sa position
	var tilePosition = $(tile).position();
	//On l'ajoute sur le jeu
	$('#board-container').append('<div id="lastadded" class="tile" data-row="' + $(tile).attr('data-row') + '" data-col="' + $(tile).attr('data-col') + '">2</div>');
	$('#lastadded').css({top:(tilePosition.top + 8) + 'px', left:(tilePosition.left + 8) + 'px'});
	$('#lastadded').fadeTo(animationSpeed*2, 1, function() {
		canMove = true;
	})
	$('#lastadded').attr('id', '');
}

//Fonction permettant de colorer les cases en fonction de leurs scores
function colorTiles() {
	$('.tile').sort(function(a,b) {
		return parseInt($(a).html()) > parseInt($(b).html()) ? -1 : 1;
	//Pour toute les cases
	}).each(function() {
		scoreContent = $(this).html();
		$(this).removeClass('tile-' + scoreContent);
        $(this).removeAttr("class");
		$(this).addClass('tile tile-' + scoreContent);
	});
}

function canMoveFn() {
	var movePossible = false
	for(i = 0; i <= 3; i++) {
		for(y = 0; y <= 3; y++) {
			if($('.board-tile[data-col=' + i + '][data-row=' + y + ']').hasClass('empty-tile')) {
				movePossible = true
			}
		}
	}
	
	$('.tile').sort(function(a, b) {
		return parseInt($(a).html()) > parseInt($(b).html()) ? -1 : 1;
	//Pour toute les cases
	}).each(function() {
		//On récupère la valeur de la case
		var currentCol = parseInt($(this).attr('data-col'));
		var currentRow = parseInt($(this).attr('data-row'));
		//On travail sur la colonne
		switch(currentCol) {
			//Si on est dans la colonne de gauche
			case 0:
				//Si la case de droite est égale à la case actuelle
				if($(this).html() == $('.tile[data-col=' + (currentCol + 1) + '][data-row=' + currentRow + ']').html()) {
					//Un mouvement est possible
					movePossible = true;
				}
			break;

			//Si on est dans une des colonnes du milieu
			case 1:
			case 2:
				//Si la case de droite est égale à la case actuelle
				if($(this).html() == $('.tile[data-col=' + (currentCol + 1) + '][data-row=' + currentRow + ']').html()) {
					movePossible = true;
				}
				if($(this).html() == $('.tile[data-col=' + (currentCol - 1) + '][data-row=' + currentRow + ']').html()) {
					movePossible = true;
				}
			break;

			case 3:
				if($(this).html() == $('.tile[data-col=' + (currentCol - 1) + '][data-row=' + currentRow + ']').html()) {
					movePossible = true;
				}
			break;
		}

		switch(currentRow) {
			case 0:
				if($(this).html() == $('.tile[data-col=' + currentCol + '][data-row=' + (currentRow + 1) + ']').html()) {
					movePossible = true;
				}
			break;

			case 1:
			case 2:
				if($(this).html() == $('.tile[data-col=' + currentCol + '][data-row=' + (currentRow + 1) + ']').html()) {
					movePossible = true;
				}
				if($(this).html() == $('.tile[data-col=' + currentCol + '][data-row=' + (currentRow - 1) + ']').html()) {
					movePossible = true;
				}
			break;

			case 3:
				if($(this).html() == $('.tile[data-col=' + currentCol + '][data-row=' + (currentRow - 1) + ']').html()) {
					movePossible = true;
				}
			break;
		}
	});

	return movePossible;
}

function gameOverFn() {
	$("#gameOver").fadeIn('slow');
}