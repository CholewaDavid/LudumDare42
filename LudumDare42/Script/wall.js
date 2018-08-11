function Wall(game, canvasContext, tile, position){
	Entity.call(this, game, canvasContext, position, true);
	
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/wall.svg");
}

Wall.prototype = Object.create(Entity.prototype);

Wall.prototype.draw = function(){
	this.sprite.draw();
}