function Game(canvas){
	this.START_GAME_CAMERA_PAN_SPEED = 5;
	this.startGameCameraPanProgress = 0;
	this.canvas = canvas;
	this.runGame = false;
	this.background = new Sprite(this.getCanvasContext(), [0,0], "Images/gameBackground.svg", 0);
	this.gameOverSprite = new Sprite(this.getCanvasContext(), [13, 50], "Images/gameOver.svg", 0);
	this.gameOver = false;
	
	this.computePositions();
	this.board = new Board(this, this.canvas, [716, 57]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
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
}

Game.prototype.draw = function(){
	this.background.draw();
	this.player.draw();
}

Game.prototype.getCanvasContext = function(){
	return this.canvas.getContext("2d");
}

Game.prototype.setGameOver = function(){
	this.gameOver = true;
}

Game.prototype.gameOverScene = function(){
	currentMode = CurrentModeEnum.menu;
	entryMenu.endGame();
	entryMenu.draw();
	return;
}

Game.prototype.computePositions = function(){
	var scale = this.background.height / this.canvas.height;
	this.canvas.getContext("2d").scale(scale, scale);
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