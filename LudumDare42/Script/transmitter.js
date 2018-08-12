function Transmitter(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/transmitter.svg");
}

Transmitter.prototype = Object.create(Entity.prototype);

Transmitter.prototype.draw = function(){
	this.sprite.draw();
}