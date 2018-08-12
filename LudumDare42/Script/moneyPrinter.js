function MoneyPrinter(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.FLUID_INCRESE_SPEED = 0.005;
	this.MONEY_INCREASE_SPEED = 0.01;
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/moneyPrinter.svg");
	this.connected = false;
}

MoneyPrinter.prototype = Object.create(Entity.prototype);

MoneyPrinter.prototype.draw = function(){
	this.sprite.draw();
}

MoneyPrinter.prototype.update = function(){
	if(!this.connected)
		this.checkFluidConnectivity();
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