var entryMenu = null;
var game = null;
var entryMenuIntervalId = null;
var windowDrawInterval = 1000/60;
var CurrentModeEnum = Object.freeze({"game": 1, "menu": 2})
var currentMode = CurrentModeEnum.menu;

window.onload = function(){
	document.getElementById("canvasGame").addEventListener('click', function(event) {
		if(currentMode == CurrentModeEnum.game && game.runGame){
			var rect = this.getBoundingClientRect();
			var x = (event.clientX - rect.left) + game.board.pos[0] - 120;
			var y = (event.clientY - rect.top) + game.board.pos[1] - 65;
			var clickedTile = game.board.convertPosToTile([x, y]);
			if(clickedTile[0] < 0 || clickedTile[1] < 0 || clickedTile[0] >= game.board.sizeX || clickedTile[1] >= game.board.sizeY)
				return;
			game.board.getTile(clickedTile).addEntity(new Pipe(game, game.getCanvasContext(), clickedTile));
			//console.log(clickedTile);
		}
	}, false);
	
	document.getElementById("canvasGame").getContext("2d").save();
	game = new Game(document.getElementById("canvasGame"));
	entryMenu = new EntryMenu(document.getElementById("canvasGame"));
	entryMenuIntervalId = window.setInterval(function () { entryMenu.draw(); }, windowDrawInterval);
}

window.onkeydown = function(event){
	switch(currentMode){
	case 1:
		switch(event.keyCode){
			case 87:
			case 38:
				game.player.enableMovementDirection(game.player.MovementEnum.up);
				break;
			case 83:
			case 40:
				game.player.enableMovementDirection(game.player.MovementEnum.down);
				break;
			case 65:
			case 37:
				game.player.enableMovementDirection(game.player.MovementEnum.left);
				break;
			case 68:
			case 39:
				game.player.enableMovementDirection(game.player.MovementEnum.right);
				break;
		}
		break;
	case 2:
		switch(event.keyCode){
			case 87:
			case 38:
				entryMenu.changeMenuItem(-1);
				break;
			case 83:
			case 40:
				entryMenu.changeMenuItem(1);
				break;
			case 13:
			case 32:
				entryMenu.activateButton();
				break;
		}
		break;
	}
}

window.onkeyup = function(event){
	switch(currentMode){
	case 1:
		switch(event.keyCode){
			case 87:
			case 38:
				game.player.disableMovementDirection(game.player.MovementEnum.up);
				break;
			case 83:
			case 40:
				game.player.disableMovementDirection(game.player.MovementEnum.down);
				break;
			case 65:
			case 37:
				game.player.disableMovementDirection(game.player.MovementEnum.left);
				break;
			case 68:
			case 39:
				game.player.disableMovementDirection(game.player.MovementEnum.right);
				break;
		}
		break;
	}
}

function getCursorPosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    console.log("x: " + x + " y: " + y);
}