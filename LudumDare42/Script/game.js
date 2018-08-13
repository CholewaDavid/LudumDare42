function Game(canvas){
	this.START_GAME_CAMERA_PAN_SPEED = 5;
	this.CAR_SPAWN_POSITION = [1209, -100];
	this.WARNING_TOGGLE_TIME = 60;
	
	this.BuildingEnum = Object.freeze({"pipe": 1, "input": 2, "output": 3, "storageTank": 4, "transmitter": 5, "moneyPrinter": 6, "generator": 7, "transformer": 8, "transmitionTower": 9});
	
	this.startGameCameraPanProgress = 0;
	this.canvas = canvas;
	this.scale;
	this.runGame = false;
	this.background = new Sprite(this.getCanvasContext(), [0,0], "Images/gameBackground.svg");
	this.uiMoneyPowerSprite = new Sprite(this.getCanvasContext(), [600, 0], "Images/uiInfoPanel.svg")
	this.gameOverSprite = new Sprite(this.getCanvasContext(), [13, 50], "Images/gameOver.svg");
	this.buildingGhostSprite = new Sprite(this.getCanvasContext(), [0,0], "Images/Pipes/pipe_NSEW.svg");
	this.buildingInfoSprites = [];
	this.gameOver = false;
	this.building = false;
	this.selectedBuilding = null;
	this.uiBuildings = [];
	this.transmitterCount = 0;
	this.power = 10;
	this.usedPower = 0;
	this.warningTimer = 0;
	this.showingWarning = false;
	this.lastSelectedBuilding = 0;
	this.audioLoop = null;
	
	this.money = 40;
	this.pricePipe = 2;
	this.priceInput = 75;
	this.priceOutput = 25;
	this.priceStorageTank = 15;
	this.priceTransmitter = 35;
	this.priceMoneyPrinter = 50;
	this.priceGenerator = 15;
	this.priceTransformer = 20;
	this.priceTransmitionTower = 5;
	
	this.computePositions();
	this.board = new Board(this, this.canvas, [720, 65]);
	this.player = new Player(this, this.getCanvasContext(), this.board.getPlayerSpawnTile());
	this.cars = [];
	this.powerStation = null;
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
	this.transmitterCount = 0;
	this.player.update();
	this.toxicBarrel.update();
	this.board.update();
	
	//Car spawn chance
	if(Math.floor(Math.random()*1000) >= 999 - 2*this.transmitterCount)
		this.spawnCar();
	
	for(var i = 0; i < this.cars.length; i++){
		this.cars[i].update();
	}
	
	//Delete cars
	for(var i = this.cars.length - 1; i >= 0; i--){
		if(this.cars[i].position[1] > 1000){
			this.money += this.cars[i].getMoney();
			this.cars[i].audioLoop.pause();
			this.cars.splice(i, 1);
		}
	}
	
	//Enable/disable uiBuildings
	this.uiBuildings[0].disabled = this.money < this.pricePipe;
	this.uiBuildings[1].disabled = this.money < this.priceInput;
	this.uiBuildings[2].disabled = this.money < this.priceOutput;
	this.uiBuildings[3].disabled = this.money < this.priceStorageTank;
	this.uiBuildings[4].disabled = this.money < this.priceTransmitter;
	this.uiBuildings[5].disabled = this.money < this.priceMoneyPrinter;
	this.uiBuildings[6].disabled = this.money < this.priceGenerator;
	this.uiBuildings[7].disabled = this.money < this.priceTransformer;
	this.uiBuildings[8].disabled = this.money < this.priceTransmitionTower;
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
	
	if(this.showingWarning){
		for(var i = 0; i < this.board.sizeX; i++){
			for(var j = 0; j < this.board.sizeY; j++){
				var building = this.board.getTile([i,j]).getBuilding();
				if(building == null)
					continue;
				if(building instanceof Generator || building instanceof MoneyPrinter || building instanceof Output || building instanceof StorageTank || building instanceof Transformer || building instanceof TransmitionTower || building instanceof Transmitter)
					building.showWarning();
			}
		}
	}
	this.warningTimer++;
	if(this.warningTimer >= this.WARNING_TOGGLE_TIME){
		this.warningTimer = 0;
		this.showingWarning = !this.showingWarning;
		if(this.showingWarning){
			for(var i = 0; i < this.board.sizeX; i++){
				for(var j = 0; j < this.board.sizeY; j++){
					var building = this.board.getTile([i,j]).getBuilding();
					if(building == null)
						continue;
					if(building instanceof MoneyPrinter || building instanceof Output)
						building.toggleWarningType();
				}
			}
		}
	}
}

Game.prototype.getCanvasContext = function(){
	return this.canvas.getContext("2d");
}

Game.prototype.setGameOver = function(){
	this.gameOver = true;
}

Game.prototype.gameOverScene = function(){
	this.audioLoop.pause();
	for(var i = 0; i < this.cars.length; i++){
		this.cars[i].audioLoop.pause();
	}
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
	this.audioLoop = new Audio("Sounds/music.wav");
	this.audioLoop.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
	}, false);
	this.audioLoop.play();
}

Game.prototype.addStructures = function(){
	this.board.getTile([0,7]).addEntity(new Input(this, this.getCanvasContext(), [0,7]));
	this.powerStation = new PowerStation(this, this.getCanvasContext(), [0,2]);
	this.board.getTile([0,2]).addEntity(this.powerStation);
	var obstacleAmount = Math.floor(Math.random()*10+20);
	for(var i = 0; i < obstacleAmount; i++){
		var obstaclePosition = [];
		obstaclePosition[0] = Math.floor(Math.random()*this.board.sizeX);
		obstaclePosition[1] = Math.floor(Math.random()*this.board.sizeY);
		if(this.board.getTile(obstaclePosition).getBuilding() == null)
			this.board.getTile(obstaclePosition).addEntity(new Obstacle(this, this.getCanvasContext(), obstaclePosition, Math.floor(Math.random()*2+1)));
	}
}

Game.prototype.spawnCar = function(){
	var impossibleTiles = [];
	for(var i = 0; i < this.cars.length; i++){
		if(this.cars[i].leaving)
			continue;
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
	this.money = 40;
	this.powerStation = null;
	this.power = 10;
	this.usedPower = 0;
	this.lastSelectedBuilding = 0;
	this.transmitterCount = 0;
	this.warningTimer = 0;
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
			var audio = new Audio("Sounds/build.ogg");
			audio.play();			
			break;
		case this.BuildingEnum.input:
			if(tile[0] != 0)
				break;
			if(this.money < this.priceInput)
				break;
			boardTile.addEntity(new Input(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceInput;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.output:
			if(tile[0] != this.board.sizeX - 1)
				break;
			if(this.money < this.priceOutput)
				break;
			boardTile.addEntity(new Output(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceOutput;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.storageTank:
			if(this.money < this.priceStorageTank)
				break;
			boardTile.addEntity(new StorageTank(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceStorageTank;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.transmitter:
			if(this.money < this.priceTransmitter)
				break;
			boardTile.addEntity(new Transmitter(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceTransmitter;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.moneyPrinter:
			if(this.money < this.priceMoneyPrinter)
				break;
			boardTile.addEntity(new MoneyPrinter(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceMoneyPrinter;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.generator:
			if(this.money < this.priceGenerator)
				break;
			boardTile.addEntity(new Generator(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceGenerator;
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.transformer:
			if(this.money < this.priceTransformer)
				break;
			boardTile.addEntity(new Transformer(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceTransformer;
			this.updatePowerConnectivity();
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
			break;
		case this.BuildingEnum.transmitionTower:
			if(this.money < this.priceTransmitionTower)
				break;
			boardTile.addEntity(new TransmitionTower(game, game.getCanvasContext(), tile));
			built = true;
			this.money -= this.priceTransmitionTower;
			this.updatePowerConnectivity();
			var audio = new Audio("Sounds/build.ogg");
			audio.play();		
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
	if(!this.runGame)
		return;
	if(building == this.selectedBuilding)
		building = null;
	switch(building){
		case this.BuildingEnum.pipe:
			this.activateUIBuilding(0);
			this.lastSelectedBuilding = building;
			if(this.money < this.pricePipe){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.pipe;
			this.building = true;
			var img = new Image();
			img.source = "Images/Pipes/pipe_NSEW.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.input:
			this.activateUIBuilding(1);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceInput){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.input;
			this.building = true;
			var img = new Image();
			img.source = "Images/input.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.output:
			this.activateUIBuilding(2);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceOutput){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.output;
			this.building = true;
			var img = new Image();
			img.source = "Images/output.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.storageTank:
			this.activateUIBuilding(3);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceStorageTank){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.storageTank;
			this.building = true;
			var img = new Image();
			img.source = "Images/storageTank.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.transmitter:
			this.activateUIBuilding(4);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceTransmitter){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.transmitter;
			this.building = true;
			var img = new Image();
			img.source = "Images/transmitter.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.moneyPrinter:
			this.activateUIBuilding(5);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceMoneyPrinter){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.moneyPrinter;
			this.building = true;
			var img = new Image();
			img.source = "Images/moneyPrinter.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.generator:
			this.activateUIBuilding(6);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceGenerator){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.generator;
			this.building = true;
			var img = new Image();
			img.source = "Images/generator.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.transformer:
			this.activateUIBuilding(7);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceTransformer){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.transformer;
			this.building = true;
			var img = new Image();
			img.source = "Images/transformer.svg";
			this.buildingGhostSprite.image = img;
			break;
		case this.BuildingEnum.transmitionTower:
			this.activateUIBuilding(8);
			this.lastSelectedBuilding = building;
			if(this.money < this.priceTransmitionTower){
				this.selectedBuilding = null;
				this.building = false;
				break;
			}
			this.selectedBuilding = this.BuildingEnum.transmitionTower;
			this.building = true;
			var img = new Image();
			img.source = "Images/transmitionTower.svg";
			this.buildingGhostSprite.image = img;
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
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/storageTank.svg", this.getCanvasContext(), this.priceStorageTank, 4));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/transmitter.svg", this.getCanvasContext(), this.priceTransmitter, 5));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/moneyPrinter.svg", this.getCanvasContext(), this.priceMoneyPrinter, 6));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/generator.svg", this.getCanvasContext(), this.priceGenerator, 7));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/transformer.svg", this.getCanvasContext(), this.priceTransformer, 8));
	this.uiBuildings.push(new UIBuilding(uiBuildingsPos, "Images/transmitionTower.svg", this.getCanvasContext(), this.priceTransmitionTower, 9));
	
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoPipe.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoInput.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoOutput.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoStorageTank.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoTransmitter.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoMoneyPrinter.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoGenerator.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoTransformer.svg"));
	this.buildingInfoSprites.push(new Sprite(this.getCanvasContext(), [600, 450], "Images/BuildingInfo/buildingInfoTransmitionTower.svg"));
}

Game.prototype.drawUI = function(){
	if(this.building){
		var canvasMousePosition = mousePosition.slice();
		canvasMousePosition[0] += game.board.pos[0] - 120;
		canvasMousePosition[1] += game.board.pos[1] - 65;
		var selectedTile = this.board.convertPosToTile(canvasMousePosition);
		if(!(selectedTile[0] < 0 || selectedTile[0] >= this.board.sizeX || selectedTile[1] < 0 || selectedTile[1] >= this.board.sizeY)){
			this.buildingGhostSprite.position = this.board.convertTileToPos(selectedTile).slice();
			this.buildingGhostSprite.draw();
		}
	}
	
	this.uiMoneyPowerSprite.draw();
	for(var i = 0; i < this.uiBuildings.length; i++)
		this.uiBuildings[i].draw();
	this.getCanvasContext().font = "18px Arial";
	this.getCanvasContext().fillText(Math.floor(this.money) + "$", 630, 120);
	this.toxicBarrel.drawFluidFillText();
	
	if(this.selectedBuilding != null)
		this.buildingInfoSprites[this.selectedBuilding-1].draw();
	
	this.player.drawFluidFillText();
	for(var i = 0; i < this.cars.length; i++)
		this.cars[i].drawFluidFillText();
	for(var i = 0; i < this.board.sizeX; i++){
		for(var j = 0; j < this.board.sizeY; j++){
			var building = this.board.getTile([i,j]).getBuilding();
			if(building == null)
				continue;
			if(building instanceof StorageTank)
				building.drawFluidFillText();
		}
	}
	this.powerStation.drawPowerAmountText();
}

Game.prototype.updatePowerConnectivity = function(){
	for(var i = 0; i < this.board.sizeX; i++){
		for(var j = 0; j < this.board.sizeY; j++){
			var building = this.board.getTile([i,j]).getBuilding();
			if(building == null)
				continue;
			if(building instanceof TransmitionTower)
				building.checkConnectivity();
		}
	}
}

Game.prototype.enoughPower = function(){
	return this.power >= this.usedPower;
}

Game.prototype.selectNextBuilding = function(delta){
	var nextBuilding = this.lastSelectedBuilding - delta;
	if(nextBuilding < 1)
		this.chooseSelectedBuilding(this.BuildingEnum.transmitionTower);
	else if(nextBuilding > this.BuildingEnum.transmitionTower)
		this.chooseSelectedBuilding(this.BuildingEnum.pipe);
	else
		this.chooseSelectedBuilding(nextBuilding);
}