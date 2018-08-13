function Transformer(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/transformer.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.connected = false;
}

Transformer.prototype = Object.create(Entity.prototype);

Transformer.prototype.draw = function(){
	this.sprite.draw();
}

Transformer.prototype.update = function(){

}

Transformer.prototype.showWarning = function(){
	if(!this.connected)
		this.powerWarningSprite.draw();
}