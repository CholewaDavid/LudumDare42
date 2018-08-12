function Game(canvas){
	this.START_GAME_CAMERA_PAN_SPEED = 5;
	this.CAR_SPAWN_POSITION = [1209, -100];
	
	this.BuildingEnum = Object.freeze({"pipe": 1, "input": 2, "output": 3});
	
	this.startGameCameraPanProgress = 0;
	this.canvas = canvas;
	this.scale;
	this.runGame = false;
	this.background = new Sprite(this.getCanvasContext(), [0,0], "Images/gameBackground.svg", 0);
	this.gameOverSprite = new Sprite(this.getCanvasContext(), [13, 50], "Images/gameOver.svg", 0);
	this.gameOver = false;
	this.building = false;
	this.selectedBuilding = null;
	this.uiBuildings = [];
	
	this.money = 0;
	this.pricePipe = 5;
	this.priceInput = 50;
	this.priceOutput = 25;
	
	this.computePositions();
	this.board = new Board(this, this.canvas, [720, 65]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
	this.cars = [];
	this.toxicBarrel = new ToxicBarrel(this, this.getCanvasContext(), [525, 100]);
	this.addStructures();
	this.addUIElements();
}


Game.prototype.gameLoop = function(){
	if(this.runGame){
		this.update();
	}
	else{
		this.startGameCameraPan();
	}
	this.draw();
}

Game.prototype.update = function(){
	if(this.gameOver){
		this.gameOverScene();
		return;
	}
	this.player.update();
	this.toxicBarrel.update();
	this.board.update();
	
	//Car spawn chance
	if(Math.floor(Math.random()*1000) == 990)
		this.spawnCar();
	
	for(var i = 0; i < this.cars.length; i++){
		this.cars[i].update();
	}
	
	//Delete cars
	for(var i = this.cars.length - 1; i >= 0; i--){
		if(this.cars[i].position[1] > 1000){
			this.money += this.cars[i].getMoney();
			this.cars.splice(i, 1);
		}
	}
}

Game.prototype.draw = function(){
	this.background.draw();
	this.board.draw();
	this.player.draw();
	this.toxicBarrel.draw();
	for(var i = 0; i < this.cars.length; i++){
		this.cars[i].draw();
	}
	if(this.runGame)
		this.drawUI();
}

Game.prototype.getCanvasContext = function(){
	return this.canvas.getContext("2d");
}

Game.prototype.setGameOver = function(){
	this.gameOver = true;
}

Game.prototype.gameOverScene = function(){
	this.canvas.getContext("2d").translate(this.START_GAME_CAMERA_PAN_SPEED, 0);
	this.startGameCameraPanProgress-=this.START_GAME_CAMERA_PAN_SPEED;
	if(this.startGameCameraPanProgress <= 0)
		this.endGame();
}

Game.prototype.endGame = function(){
	currentMode = CurrentModeEnum.menu;
	entryMenu.endGame();
	entryMenu.draw();
}

Game.prototype.computePositions = function(){
	var scale = this.background.image.height / this.canvas.height;
	this.canvas.getContext("2d").scale(scale, scale);
	this.scale = scale;
}

Game.prototype.startGameCameraPan = function(){
		this.canvas.getContext("2d").translate(-this.START_GAME_CAMERA_PAN_SPEED, 0);
		this.startGameCameraPanProgress+=this.START_GAME_CAMERA_PAN_SPEED;
		if(this.startGameCameraPanProgress >= 600)
			this.startGame();
}

Game.prototype.startGame = function(){
	this.runGame = true;
	/*
	this.audioLoop = new Audio("Sounds/ToxicSludge.ogg");
	this.audioLoop.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
	}, false);
	this.audioLoop.play();
	*/
}

Game.prototype.addStructures = function(){
	this.board.getTile([0,7]).addEntity(new Input(this, this.getCanvasContext(), [0,7]));
}

Game.prototype.spawnCar = function(){
	var impossibleTiles = [];
	for(var i = 0; i < this.cars.length; i++){
		var parkingTile = this.cars[i].parkingTileY;
		impossibleTiles.push(parkingTile - 2);
		impossibleTiles.push(parkingTile - 1);
		impossibleTiles.push(parkingTile);
		impossibleTiles.push(parkingTile + 1);
		impossibleTiles.push(parkingTile + 2);
	}
	var possibleTiles = [];
	for(var i = 0; i < this.board.sizeY; i++){
		if(!(impossibleTiles.indexOf(i) != -1))
			possibleTiles.push(i);
	}
	if(possibleTiles.length == 0)
		return;
	var tileY = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
	this.cars.push(new Car(this, this.getCanvasContext(), this.CAR_SPAWN_POSITION, this.board.convertTileToPos([0, tileY - 1])[1], tileY));
}

Game.prototype.reset = function(){
	this.runGame = false;
	this.gameOver = false;
	this.building = false;
	this.board = new Board(this, this.canvas, [720, 65]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
	this.cars = [];
	this.toxicBarrel = new ToxicBarrel(this, this.getCanvasContext(), [525, 100]);
	this.selectedBuilding = null;
	this.money = 0;
	this.addStructures();
}

Game.prototype.buildEntity = function(tile){
	var boardTile = this.board.getTile(tile);
	var built = false;
	switch(this.selectedBuilding){
		case this.BuildingEnum.pipe:
			if(this.money < this.pricePipe)
				break;
			boardTile.addEntity(new Pipe(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.pricePipe;
			break;
		case this.BuildingEnum.input:
			if(tile[0] != 0)
				break;
			if(this.money < this.priceInput)
				break;
			boardTile.addEntity(new Input(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceInput;
			break;
		case this.BuildingEnum.output:
			if(tile[0] != this.board.sizeX - 1)
				break;
			if(this.money < this.priceOutput)
				break;
			boardTile.addEntity(new Output(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceOutput;
			break;
	}
	
	if(built){
		for(var i = 0; i < this.board.sizeX; i++){
			for(var j = 0; j < this.board.sizeY; j++){
				var tile = this.board.getTile([i,j]);
				var building = tile.getBuilding();
				if(building instanceof Pipe)
					building.updateSprite();
			}
		}
	}
}

Game.prototype.chooseSelectedBuilding = function(building){
	switch(building){
		case this.BuildingEnum.pipe:
			this.selectedBuilding = this.BuildingEnum.pipe;
			this.building = true;
			this.activateUIBuilding(0);
			break;
		case this.BuildingEnum.input:
			this.selectedBuilding = this.BuildingEnum.input;
			this.building = true;
			this.activateUIBuilding(1);
			break;
		case this.BuildingEnum.output:
			this.selectedBuilding = this.BuildingEnum.output;
			this.building = true;
			this.activateUIBuilding(2);
			break;
		case null:
			this.selectedBuilding = null;
			this.building = false;
			this.activateUIBuilding(-1);
			break;
	}
}

Game.prototype.activateUIBuilding = function(id){
	for(var i = 0; i < this.uiBuildings.length; i++)
		this.uiBuildings[i].active = false;
	if(id < 0)
		return;
	this.uiBuildings[id].active = true;
}

Game.prototype.addUIElements = function(){
	var uiBuildingsPos = [600, 600];
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/Pipes/pipe_EW.svg", this.getCanvasContext(), this.pricePipe, 1));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/input.svg", this.getCanvasContext(), this.priceInput, 2));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/output.svg", this.getCanvasContext(), this.priceOutput, 3));
}

Game.prototype.drawUI = function(){
	for(var i = 0; i < this.uiBuildings.length; i++)
		this.uiBuildings[i].draw();
	this.getCanvasContext().font = "20px Arial";
	this.getCanvasContext().fillText(Math.floor(this.money) + "$", 800, 600);
	this.toxicBarrel.drawFluidFillText();
	this.player.drawFluidFillText();
	for(var i = 0; i < this.cars.length; i++)
		this.cars[i].drawFluidFillText();
}