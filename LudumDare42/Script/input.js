function Input(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/input.svg");
}

Input.prototype = Object.create(Entity.prototype);

Input.prototype.draw = function(){
	this.sprite.draw();
}

Input.prototype.takeFluid = function(amount){
	return game.toxicBarrel.removeFluid(amount);
}