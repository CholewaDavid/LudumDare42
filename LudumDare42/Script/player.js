function Player(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), false);
	
	this.MAXIMUM_FLUID = 50;
	
	this.MovementEnum = Object.freeze({"left": 1, "up": 2, "right": 3, "down": 4});
	
	this.tile = tile.slice();
	this.movementDirections = [false, false, false, false];
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/player.svg");
	this.speed = 5;
	this.fluid = 0;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.draw = function(){
	this.sprite.position = this.position.slice();
	this.canvasContext.translate(0,-this.sprite.image.height);
	this.sprite.draw();
	this.canvasContext.translate(0,this.sprite.image.height);
}

Player.prototype.update = function(){
	this.move();
}

Player.prototype.move = function(){
	var targetPos = this.position.slice();
	var movementVector = this.getMovementVector();
	if(movementVector[0] == 0 && movementVector[1] == 0)
		return;
	targetPos[0] += movementVector[0];
	targetPos[1] += movementVector[1];
	
	var targetTile = this.game.board.convertPosToTile(targetPos);
	
	//Not going out of bounds
	if(targetTile[0] < 0){
		targetTile[0] = 0;
		targetPos[0] = this.game.board.getTileBox([0,1])[0];
	}
	else if(targetTile[0] >= this.game.board.sizeX - 1){
		targetTile[0] = this.game.board.sizeX - 1;
		targetPos[0] = this.game.board.getTileBox([targetTile[0], 1])[0];
	}
	if(targetTile[1] < 0){
		targetTile[1] = 0;
		targetPos[1] = this.game.board.getTileBox([1,0])[1];
	}
	else if(targetTile[1] >= this.game.board.sizeY - 1){
		targetTile[1] = this.game.board.sizeY - 1;
		targetPos[1] = this.game.board.getTileBox([1, targetTile[1]])[1];
	}
	
	//Going to another tile
	if(targetTile[0] != this.tile[0] || targetTile[1] != this.tile[1]){
		//Solid obstacle
		if(this.game.board.getTile(targetTile).isSolid()){
			var tileEndPos = this.game.board.getTileBox(this.tile);
			if(targetTile[0] < this.tile[0]){
				this.position[0] = tileEndPos[0];
			}
			else if(targetTile[0] > this.tile[0]){
				this.position[0] = tileEndPos[2];
			}
			else{
				this.position[0] = targetPos[0];
			}
			if(targetTile[1] < this.tile[1]){
				this.position[1] = tileEndPos[1];
			}
			else if(targetTile[1] > this.tile[1]){
				this.position[1] = tileEndPos[3];
			}
			else{
				this.position[1] = targetPos[1];
			}
		}
		else{
			this.position = targetPos.slice();
			this.tile = targetTile.slice();
		}
	}
	else{
		this.position = targetPos.slice();
	}
}

Player.prototype.getMovementVector = function(){
	var output = [0,0];

	if(this.movementDirections[0])
		output[0] -= 1;
	if(this.movementDirections[1])
		output[1] -= 1;
	if(this.movementDirections[2])
		output[0] += 1;
	if(this.movementDirections[3])
		output[1] += 1;

	output[0] *= this.speed;
	output[1] *= this.speed;
	return output;
}

Player.prototype.enableMovementDirection = function(dir){
	this.movementDirections[dir-1] = true;
}

Player.prototype.disableMovementDirection = function(dir){
	this.movementDirections[dir-1] = false;
}

Player.prototype.takeFluid = function(amount){
	this.fluid += amount;
	amount = 0;
	if(this.fluid > this.MAXIMUM_FLUID){
		amount = this.fluid - this.MAXIMUM_FLUID;
		this.fluid = this.MAXIMUM_FLUID;
	}
	return amount;
}