function Transmitter(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.NEEDS_POWER = 2;
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/transmitter.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.powerConnected = false;
}

Transmitter.prototype = Object.create(Entity.prototype);

Transmitter.prototype.draw = function(){
	this.sprite.draw();
}

Transmitter.prototype.update = function(){
	if(!this.powerConnected){
		this.checkPowerConnectivity();
		return;
	}
	if(!this.game.enoughPower())
		return;
	this.game.transmitterCount++;
}

Transmitter.prototype.checkPowerConnectivity = function(){
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

Transmitter.prototype.showWarning = function(){
	if(!this.powerConnected || this.game.power < this.game.usedPower)
		this.powerWarningSprite.draw();
}