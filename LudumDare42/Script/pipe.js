function Pipe(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/Pipes/pipe_NSEW.svg");
	this.hasFluid = false;
	this.updateSprite();
}

Pipe.prototype = Object.create(Entity.prototype);

Pipe.prototype.draw = function(){
	this.sprite.draw();
}

Pipe.prototype.update = function(){
	if(this.hasFluid)
		return;
	
	this.checkFluidConnectivity();
}

Pipe.prototype.checkFluidConnectivity = function(){
	var tiles = [[this.tile[0]-1,this.tile[1]], [this.tile[0]+1,this.tile[1]], [this.tile[0],this.tile[1]-1], [this.tile[0],this.tile[1]+1]];
	for(var i = 0; i < tiles.length; i++){
		if(tiles[i][0] < 0 || tiles[i][0] >= this.game.board.sizeX || tiles[i][1] < 0 || tiles[i][1] >= this.game.board.sizeY)
			continue;
		var building = this.game.board.getTile(tiles[i]).getBuilding();
		if(building == null)
			continue;
		if(building instanceof Input){
			this.hasFluid = true;
			return;
		}
		if(building instanceof Pipe && building.hasFluid){
			this.hasFluid = true;
			return;
		}
	}
	this.hasFluid = false;
}

Pipe.prototype.updateSprite = function(){
	var tiles = [[this.tile[0],this.tile[1]-1], [this.tile[0],this.tile[1]+1], [this.tile[0]+1,this.tile[1]], [this.tile[0]-1,this.tile[1]]];
	var filename = "Images/Pipes/pipe_";
	var foundPipe = false;
	for(var i = 0; i < tiles.length; i++){
		if(tiles[i][0] < 0 || tiles[i][0] >= this.game.board.sizeX || tiles[i][1] < 0 || tiles[i][1] >= this.game.board.sizeY)
			continue;
		
		var building = this.game.board.getTile(tiles[i]).getBuilding();
		if(building == null)
			continue;
		
		if(building instanceof Input || building instanceof Pipe || building instanceof Output){
			if(tiles[i][1] < this.tile[1]){
				filename += "N";
				foundPipe = true;
			}
			if(tiles[i][1] > this.tile[1]){
				filename += "S";
				foundPipe = true;
			}
			if(tiles[i][0] > this.tile[0]){
				filename += "E";
				foundPipe = true;
			}
			if(tiles[i][0] < this.tile[0]){
				filename += "W";
				foundPipe = true;
			}
		}
	}
	if(!foundPipe)
		filename += "NSEW";
	
	filename += ".svg";
	var image = new Image();
	image.src = filename;
	this.sprite.image = image;
}