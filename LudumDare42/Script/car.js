function Car(game, canvasContext, pos, parkingPosY, parkingTileY){
	Entity.call(this, game, canvasContext, pos, false);
	
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/car.svg");
	this.speed = 2;
	this.waiting = false;
	this.waitingTimer = 0;
	this.MAX_WAITING = 15*60;
	this.leaving = false;
	this.parkingPosY = parkingPosY;
	this.parkingTileY = parkingTileY;
}

Car.prototype = Object.create(Entity.prototype);

Car.prototype.draw = function(){
	this.sprite.position = this.position.slice();
	this.sprite.draw();
}

Car.prototype.update = function(){
	if(this.waiting){
		this.waitingTimer++;
		if(this.MAX_WAITING <= this.waitingTimer){
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