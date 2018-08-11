function Game(canvas){
	this.START_GAME_CAMERA_PAN_SPEED = 5;
	this.CAR_SPAWN_POSITION = [1209, -100];
	this.startGameCameraPanProgress = 0;
	this.canvas = canvas;
	this.scale;
	this.runGame = false;
	this.background = new Sprite(this.getCanvasContext(), [0,0], "Images/gameBackground.svg", 0);
	this.gameOverSprite = new Sprite(this.getCanvasContext(), [13, 50], "Images/gameOver.svg", 0);
	this.gameOver = false;
	
	this.computePositions();
	this.board = new Board(this, this.canvas, [720, 65]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
	this.cars = [];
	this.toxicBarrel = new ToxicBarrel(this, this.getCanvasContext(), [525, 100]);
	this.addStructures();
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
	
	//Car spawn chance
	if(Math.floor(Math.random()*1000) == 990)
		this.spawnCar();
	
	for(var i = 0; i < this.cars.length; i++){
		this.cars[i].update();
	}
	
	//Delete cars
	for(var i = this.cars.length - 1; i >= 0; i--){
		if(this.cars[i].position[1] > 1000)
			this.cars.splice(i, 1);
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
	this.board.getTile([0,0]).addEntity(new Input(this, this.getCanvasContext(), [0,0]));
	this.board.getTile([0,7]).addEntity(new Input(this, this.getCanvasContext(), [0,7]));
	this.board.getTile([0,14]).addEntity(new Input(this, this.getCanvasContext(), [0,14]));
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
	this.board = new Board(this, this.canvas, [720, 65]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
	this.cars = [];
	this.toxicBarrel = new ToxicBarrel(this, this.getCanvasContext(), [525, 100]);
	this.addStructures();
}