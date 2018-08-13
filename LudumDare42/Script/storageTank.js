function StorageTank(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.MAX_FLUID = 50;
	this.FLUID_FILL_SPEED = 0.05;
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/storageTank.svg");
	this.fluidWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noFluid.svg");
	this.connected = false;
	this.fluid = 0;
}

StorageTank.prototype = Object.create(Entity.prototype);

StorageTank.prototype.draw = function(){
	this.sprite.draw();
}

StorageTank.prototype.update = function(){
	if(!this.connected)
		this.checkFluidConnectivity();
	else{
		if(this.fluid == this.MAX_FLUID)
			return;
		this.fluid += this.game.toxicBarrel.removeFluid(this.FLUID_FILL_SPEED);
		if(this.fluid > this.MAX_FLUID){
			this.game.toxicBarrel.addFluid(this.fluid - this.MAX_FLUID);
			this.fluid = this.MAX_FLUID;
		}
	}
}

StorageTank.prototype.checkFluidConnectivity = function(){
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

StorageTank.prototype.takeFluid = function(amount){
	if(this.fluid < amount){
		var tmp = this.fluid;
		this.fluid = 0;
		return tmp;
	}
	this.fluid -= amount;
	return amount;
}

StorageTank.prototype.drawFluidFillText = function(){
	this.canvasContext.font = "18px Arial";
	this.canvasContext.textAlign = "center";
	this.canvasContext.fillText(Math.floor(this.fluid), this.position[0] + 16, this.position[1] + 27);
	this.canvasContext.textAlign = "left";
}

StorageTank.prototype.showWarning = function(){
	if(!this.connected)
		this.fluidWarningSprite.draw();
}