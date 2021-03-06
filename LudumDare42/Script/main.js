var entryMenu = null;
var game = null;
var entryMenuIntervalId = null;
var windowDrawInterval = 1000/60;
var mousePosition = [];
var CurrentModeEnum = Object.freeze({"game": 1, "menu": 2})
var currentMode = CurrentModeEnum.menu;

window.onload = function(){
	window.setTimeout(canvasLoad, 1);
	document.onmousemove = handleMouseMove;
	document.getElementById("canvasGame").addEventListener('click', function(event) {
		if(currentMode == CurrentModeEnum.game && game.runGame){
			var rect = this.getBoundingClientRect();
			var x = (event.clientX - rect.left) + game.board.pos[0] - 120;
			var y = (event.clientY - rect.top) + game.board.pos[1] - 65;
			var clickedTile = game.board.convertPosToTile([x, y]);
			var clickedCar = false;
			if(clickedTile[0] < 0 || clickedTile[1] < 0 || clickedTile[0] >= game.board.sizeX || clickedTile[1] >= game.board.sizeY){
				//Clicked road?
				if(clickedTile[0] == game.board.sizeX)
					clickedCar = true;
				else
					return;
			}
			var boardTile = game.board.getTile(clickedTile);
			
			//Building?
			if(game.building){
				if(clickedCar || boardTile.getBuilding() != null)
					return;
				game.buildEntity(clickedTile);
			}
			else{
				//Clicked tile near player
				if(clickedTile[0] < game.player.tile[0] - 1 || clickedTile[0] > game.player.tile[0] + 1 || clickedTile[1] < game.player.tile[1] - 1 || clickedTile[1] > game.player.tile[1] + 1)
					return;
				//Clicked car?
				if(clickedCar){
					for(var i = 0; i < game.cars.length; i++){
						if(game.cars[i].parkingTileY == clickedTile[1] && game.cars[i].waiting){
							game.player.fluid -= game.player.fluid - game.cars[i].addFluid(game.player.fluid);
						}
					}
					return;
				}
				//Clicked building?
				var building = boardTile.getBuilding();
				if(building == null)
					return;
				if(building instanceof Input || building instanceof StorageTank){
					game.player.takeFluid(building.takeFluid(game.player.canTakeFluidAmount()));
				}
			}
		}
	}, false);
	
	document.getElementById("canvasGame").addEventListener("mouseWheel", MouseWheelHandler, false);
	document.getElementById("canvasGame").addEventListener("DOMMouseScroll", MouseWheelHandler, false);
	
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
			case 49:
				game.chooseSelectedBuilding(game.BuildingEnum.pipe);
				break;
			case 50:
				game.chooseSelectedBuilding(game.BuildingEnum.input);
				break;
			case 51:
				game.chooseSelectedBuilding(game.BuildingEnum.output);
				break;
			case 52:
				game.chooseSelectedBuilding(game.BuildingEnum.storageTank);
				break;
			case 53:
				game.chooseSelectedBuilding(game.BuildingEnum.transmitter);
				break;
			case 54:
				game.chooseSelectedBuilding(game.BuildingEnum.moneyPrinter);
				break;
			case 55:
				game.chooseSelectedBuilding(game.BuildingEnum.generator);
				break;
			case 56:
				game.chooseSelectedBuilding(game.BuildingEnum.transformer);
				break;
			case 57:
				game.chooseSelectedBuilding(game.BuildingEnum.transmitionTower);
				break;
			case 27:
				game.chooseSelectedBuilding(null);
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

function canvasLoad(){
	document.getElementById("canvasGame").width = 799.99999;
	document.getElementById("canvasGame").width = 800;
}

function MouseWheelHandler(e){
	if(currentMode != 1 || !game.runGame)
		return;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	game.selectNextBuilding(delta);
}

function handleMouseMove(event){
	mousePosition[0] = event.clientX;
	mousePosition[1] = event.clientY;
	mousePosition[0] -= document.getElementById("canvasGame").getBoundingClientRect().left;
	mousePosition[1] -= document.getElementById("canvasGame").getBoundingClientRect().top;
}