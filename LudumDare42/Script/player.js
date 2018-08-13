function Player(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), false);
	
	this.MAXIMUM_FLUID = 50;
	
	this.MovementEnum = Object.freeze({"left": 1, "up": 2, "right": 3, "down": 4});
	
	this.tile = tile.slice();
	this.movementDirections = [false, false, false, false];
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/player.svg");
	this.speed = 5;
	this.fluid = 0;
	this.oldFluid = 0;
}

Player.prototype = Object.create(Entity.prototype);

Player.prototype.draw = function(){
	this.sprite.position = this.position.slice();
	this.canvasContext.translate(-this.sprite.image.width/2,-this.sprite.image.height);
	this.sprite.draw();
	this.canvasContext.translate(this.sprite.image.width/2,this.sprite.image.height);
}

Player.prototype.update = function(){
	if(this.fluid != this.oldFluid){
		var audio = new Audio("Sounds/liquid.ogg");
		audio.play();
		this.oldFluid = this.fluid;
	}
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
	else if(targetTile[0] > this.game.board.sizeX - 1){
		targetTile[0] = this.game.board.sizeX - 1;
		targetPos[0] = this.game.board.getTileBox([targetTile[0], 1])[2];
	}
	if(targetTile[1] < 0){
		targetTile[1] = 0;
		targetPos[1] = this.game.board.getTileBox([1,0])[1];
	}
	else if(targetTile[1] > this.game.board.sizeY - 1){
		targetTile[1] = this.game.board.sizeY - 1;
		targetPos[1] = this.game.board.getTileBox([1, targetTile[1]])[3];
	}
	
	//Going to another tile
	if(targetTile[0] != this.tile[0] || targetTile[1] != this.tile[1]){
		var horizontal = 0;
		var vertical = 0;
		//Solid obstacle
		if(this.game.board.getTile(targetTile).isSolid()){
			var tileEndPos = this.game.board.getTileBox(this.tile);
			if(targetTile[0] < this.tile[0]){
				this.position[0] = tileEndPos[0] + 1;
				horizontal = -1;
			}
			else if(targetTile[0] > this.tile[0]){
				this.position[0] = tileEndPos[2] - 1;
				horizontal = 1;
			}
			else{
				this.position[0] = targetPos[0];
			}
			if(targetTile[1] < this.tile[1]){
				this.position[1] = tileEndPos[1] + 1;
				vertical = -1;
			}
			else if(targetTile[1] > this.tile[1]){
				this.position[1] = tileEndPos[3] - 1;
				vertical = 1;
			}
			else{
				this.position[1] = targetPos[1];
			}
			
			//Corner stuck resolve
			if(horizontal != 0 && vertical != 0){
				switch(horizontal){
					case -1:
					switch(vertical){
						case -1:
							targetTile[0] += 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[1] = targetPos[1];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[0] -= 1;
							targetTile[1] += 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[0] = targetPos[0];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[1] -= 1;
							break;
						case 1:
							targetTile[0] += 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[1] = targetPos[1];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[0] -= 1;
							targetTile[1] -= 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[0] = targetPos[0];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[1] += 1;
							break;
					}
					break;
					case 1:
					switch(vertical){
						case -1:
							targetTile[0] -= 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[1] = targetPos[1];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[0] += 1;
							targetTile[1] += 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[0] = targetPos[0];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[1] -= 1;
							break;
						case 1:
							targetTile[0] -= 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[1] = targetPos[1];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[0] += 1;
							targetTile[1] -= 1;
							if(!this.game.board.getTile(targetTile).isSolid()){
								this.position[0] = targetPos[0];
								this.tile = targetTile.slice();
								break;
							}
							targetTile[1] += 1;
							break;
					}
					break;
				}
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
	if(dir > 1)
		this.disableMovementDirection(dir-2);
	else
		this.disableMovementDirection(dir+2);
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

Player.prototype.canTakeFluidAmount = function(){
	return this.MAXIMUM_FLUID - this.fluid;
}

Player.prototype.drawFluidFillText = function(){
	this.canvasContext.translate(-this.sprite.image.width/2,-this.sprite.image.height);
	this.canvasContext.font = "20px Arial";
	this.canvasContext.fillText(Math.floor(this.fluid) + "/" + this.MAXIMUM_FLUID, this.position[0], this.position[1]);
	this.canvasContext.translate(this.sprite.image.width/2,this.sprite.image.height);
}
