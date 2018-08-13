function Car(game, canvasContext, pos, parkingPosY, parkingTileY){
	Entity.call(this, game, canvasContext, pos, false);
	
	this.MAXIMUM_FLUID = 100;
	this.MAXIMUM_MONEY = 20;
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/car.svg");
	this.speed = 2;
	this.waiting = false;
	this.waitingTimer = 0;
	this.MAX_WAITING = 15*60;
	this.leaving = false;
	this.parkingPosY = parkingPosY;
	this.parkingTileY = parkingTileY;
	this.fluid = 0;
	
	this.audioLoop = new Audio("Sounds/carDrive.ogg");
	this.audioLoop.addEventListener('ended', function() {
			this.currentTime = 0;
			this.play();
	}, false);
	this.audioLoop.play();
}

Car.prototype = Object.create(Entity.prototype);

Car.prototype.draw = function(){
	this.sprite.position = this.position.slice();
	this.sprite.draw();
}

Car.prototype.update = function(){
	if(this.waiting){
		this.waitingTimer++;
		if(this.MAX_WAITING <= this.waitingTimer || this.fluid >= this.MAXIMUM_FLUID){
			this.waiting = false;
			this.leaving = true;
			this.audioLoop.pause();
			this.audioLoop = new Audio("Sounds/carDrive.ogg");
			this.audioLoop.addEventListener('ended', function() {
					this.currentTime = 0;
					this.play();
			}, false);
			this.audioLoop.play();
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
		this.audioLoop.pause();
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

Car.prototype.getMoney = function(){
	return this.MAXIMUM_MONEY * (this.fluid / this.MAXIMUM_FLUID);
}

Car.prototype.drawFluidFillText = function(){
	this.canvasContext.font = "18px Arial";
	this.canvasContext.textAlign = "center";
	this.canvasContext.fillText(Math.floor(this.fluid), this.position[0] + 16, this.position[1] + 27);
	this.canvasContext.textAlign = "left";
}