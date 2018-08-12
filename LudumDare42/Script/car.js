function Car(game, canvasContext, pos, parkingPosY, parkingTileY){
	Entity.call(this, game, canvasContext, pos, false);
	
	this.MAXIMUM_FLUID = 100;
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/car.svg");
	this.speed = 2;
	this.waiting = false;
	this.waitingTimer = 0;
	this.MAX_WAITING = 15*60;
	this.leaving = false;
	this.parkingPosY = parkingPosY;
	this.parkingTileY = parkingTileY;
	this.fluid = 0;
}

Car.prototype = Object.create(Entity.prototype);

Car.prototype.draw = function(){
	this.sprite.position = this.position.slice();
	this.sprite.draw();
	this.canvasContext.font = "20px Arial";
	this.canvasContext.fillText(Math.floor(this.fluid) + "/" + this.MAXIMUM_FLUID, this.position[0] + 100, this.position[1]);
}

Car.prototype.update = function(){
	if(this.waiting){
		this.waitingTimer++;
		if(this.MAX_WAITING <= this.waitingTimer || this.fluid >= this.MAXIMUM_FLUID){
			this.waiting = false;
			this.leaving = true;
		}
	}	
	else{
		this.move();
	}
}

Car.prototype.move = function(){
	this.position[1] += this.speed;
	if(this.leaving)
		return;
	
	if(this.position[1] >= this.parkingPosY){
		this.position[1] = this.parkingPosY;
		this.waiting = true;
	}
}

Car.prototype.addFluid = function(amount){
	this.fluid += amount;
	amount = 0;
	if(this.fluid > this.MAXIMUM_FLUID){
		amount = this.fluid - this.MAXIMUM_FLUID;
		this.fluid = this.MAXIMUM_FLUID;
	}
	return amount;
}