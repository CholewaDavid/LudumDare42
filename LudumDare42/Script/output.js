function Output(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.FLUID_OUTPUT = 1;
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/output.svg");
	this.connected = false;
}

Output.prototype = Object.create(Entity.prototype);

Output.prototype.draw = function(){
	this.canvasContext.translate(0,-27);
	this.sprite.draw();
	this.canvasContext.translate(0,27);
}

Output.prototype.update = function(){
	if(!this.connected)
		this.checkConnectivity();
	else{
		for(var i = 0; i < this.game.cars.length; i++){
			if(this.game.cars[i].parkingTileY == this.tile[1]){
				if(this.game.cars[i].waiting)
					this.game.toxicBarrel.addFluid(this.game.cars[i].addFluid(this.game.toxicBarrel.removeFluid(this.FLUID_OUTPUT)));
				break;
			}
		}
	}
}

Output.prototype.checkConnectivity = function(){
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