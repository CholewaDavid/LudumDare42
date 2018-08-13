function Generator(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.POWER = 5;
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/generator.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.connected = false;
}

Generator.prototype = Object.create(Entity.prototype);

Generator.prototype.draw = function(){
	this.sprite.draw();
}

Generator.prototype.update = function(){
	if(this.connected)
		return;
	this.checkConnection();
}

Generator.prototype.checkConnection = function(){
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
				this.connected = true;
				this.game.power += this.POWER;
				return;
			}
		}
	}
}

Generator.prototype.showWarning = function(){
	if(!this.connected)
		this.powerWarningSprite.draw();
}