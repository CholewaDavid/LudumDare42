function Entity(game, canvasContext, position, solid){
	this.game = game;
	this.canvasContext = canvasContext;
	this.position = position.slice();
	this.solid = solid;
	this.updated = false;
}

Entity.prototype.draw = function(){
	
}

Entity.prototype.update = function(){
	
}
