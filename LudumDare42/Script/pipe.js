function Pipe(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/pipe_cross.svg");
}

Pipe.prototype = Object.create(Entity.prototype);

Pipe.prototype.draw = function(){
	this.sprite.draw();
}