function Output(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.FLUID_OUTPUT = 1;
	this.NEEDS_POWER = 10;
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/output.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.fluidWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noFluid.svg");
	this.shownWarningToggle = false;
	this.connected = false;
	this.powerConnected = false;
}

Output.prototype = Object.create(Entity.prototype);

Output.prototype.draw = function(){
	this.sprite.draw();
}

Output.prototype.update = function(){
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
	
	for(var i = 0; i < this.game.cars.length; i++){
		if(this.game.cars[i].parkingTileY == this.tile[1]){
			if(this.game.cars[i].waiting)
				this.game.toxicBarrel.addFluid(this.game.cars[i].addFluid(this.game.toxicBarrel.removeFluid(this.FLUID_OUTPUT)));
			break;
		}
	}
}

Output.prototype.checkFluidConnectivity = function(){
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

Output.prototype.checkPowerConnectivity = function(){
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

Output.prototype.showWarning = function(){
	if(this.connected && (this.powerConnected && this.game.power > this.game.usedPower))
		return;
	if(!this.connected && (!this.powerConnected || this.game.power < this.game.usedPower)){
		if(this.shownWarningToggle)
			this.powerWarningSprite.draw();
		else
			this.fluidWarningSprite.draw();
	}
	else if(!this.connected)
		this.fluidWarningSprite.draw();
	else if(!this.powerConnected || this.game.power < this.game.usedPower)
		this.powerWarningSprite.draw();
}

Output.prototype.toggleWarningType = function(){
	this.shownWarningToggle = !this.shownWarningToggle;
}