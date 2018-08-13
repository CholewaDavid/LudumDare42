function PowerStation(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/powerStation.svg");
}

PowerStation.prototype = Object.create(Entity.prototype);

PowerStation.prototype.draw = function(){
	this.sprite.draw();
}

PowerStation.prototype.drawPowerAmountText = function(){
	this.canvasContext.font = "18px Arial";
	this.canvasContext.fillText(this.game.usedPower + "/" + this.game.power, 630, 80);
}