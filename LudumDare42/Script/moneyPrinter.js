function MoneyPrinter(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.FLUID_INCRESE_SPEED = 0.005;
	this.MONEY_INCREASE_SPEED = 0.01;
	this.NEEDS_POWER = 5;
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/moneyPrinter.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.fluidWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noFluid.svg");
	this.shownWarningToggle = false;
	this.connected = false;
	this.powerConnected = false;
}

MoneyPrinter.prototype = Object.create(Entity.prototype);

MoneyPrinter.prototype.draw = function(){
	this.sprite.draw();
}

MoneyPrinter.prototype.update = function(){
	var success = true;
	if(!this.connected){
		this.checkFluidConnectivity();
		success = false;
	}
	if(!this.powerConnected){
		this.checkPowerConnectivity();
		success = false;
	}
	if(!success)
		return;
	
	if(!this.game.enoughPower())
		return;
	else{
		this.game.money += this.MONEY_INCREASE_SPEED;
		this.game.toxicBarrel.addFluid(this.FLUID_INCRESE_SPEED);
	}
}

MoneyPrinter.prototype.checkFluidConnectivity = function(){
	var tiles = [[this.tile[0]-1,this.tile[1]], [this.tile[0]+1,this.tile[1]], [this.tile[0],this.tile[1]-1], [this.tile[0],this.tile[1]+1]];
	for(var i = 0; i < tiles.length; i++){
		if(tiles[i][0] < 0 || tiles[i][0] >= this.game.board.sizeX || tiles[i][1] < 0 || tiles[i][1] >= this.game.board.sizeY)
			continue;
		var building = this.game.board.getTile(tiles[i]).getBuilding();
		if(building == null)
			continue;
		if(building instanceof Input){
			this.connected = true;
			return;
		}
		if(building instanceof Pipe && building.hasFluid){
			this.connected = true;
			return;
		}
	}
	this.connected = false;
}

MoneyPrinter.prototype.checkPowerConnectivity = function(){
	for(var i = -1; i <= 1; i++){
		for(var j = -1; j <= 1; j++){
			if(i == 0 && j == 0)
				continue;
			
			if(this.tile[0] + i < 0 || this.tile[0] + i >= this.game.board.sizeX || this.tile[1] + j < 0 || this.tile[1] + j >= this.game.board.sizeY)
				continue;
			
			var building = this.game.board.getTile([this.tile[0]+i, this.tile[1]+j]).getBuilding();
			if(building == null)
				continue;
			if(building instanceof Transformer && building.connected){
				this.powerConnected = true;
				this.game.usedPower += this.NEEDS_POWER;
				return;
			}
		}
	}
}

MoneyPrinter.prototype.showWarning = function(){
	if(this.connected && this.powerConnected)
		return;
	if(!this.connected && !this.powerConnected){
		if(this.shownWarningToggle)
			this.powerWarningSprite.draw();
		else
			this.fluidWarningSprite.draw();
	}
	else if(!this.connected)
		this.fluidWarningSprite.draw();
	else if(!this.powerConnected)
		this.powerWarningSprite.draw();
}

MoneyPrinter.prototype.toggleWarningType = function(){
	this.shownWarningToggle = !this.shownWarningToggle;
}