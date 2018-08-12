function Obstacle(game, canvasContext, tile, obstacleType){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, this.getImageFilename(obstacleType));
	this.obstacleType = obstacleType;
}

Obstacle.prototype = Object.create(Entity.prototype);

Obstacle.prototype.draw = function(){
	this.sprite.draw();
}

Obstacle.prototype.getImageFilename = function(obstacleType){
	switch(obstacleType){
		case ObstacleTypeEnum.stone:
			return "Images/stone.svg";
		case ObstacleTypeEnum.tree:
			return "Images/tree.svg";
	}
}

var ObstacleTypeEnum = Object.freeze({"stone": 1, "tree": 2});