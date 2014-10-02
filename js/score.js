function updateScore(addScore) {
	var currentScore = parseInt($('#score').html());
	var newScore = currentScore + parseInt(addScore);
	$("#addition").html('+ ' + addScore).stop(true, false).show(10).fadeOut(500);
	$('#score').empty();
	$('#score').html(newScore);
	if($('#best').html() < newScore) {
		$('#best').html(newScore);
		localStorage.removeItem("bestScore");
		sessionStorage.setItem("bestScore", newScore);
	}
}

function scoreToZero() {
	$('#score').empty();
	$('#score').html(0);
}

function addBestScore() {
	var bestScore = sessionStorage.getItem("bestScore");
	$('#best').html(bestScore);
}