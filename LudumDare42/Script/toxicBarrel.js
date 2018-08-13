function ToxicBarrel(game, canvasContext, pos){
	Entity.call(this, game, canvasContext, pos, false);
	
	this.MAXIMUM_FLUID = 1000;
	this.fluid = 0;
	this.fillSpeed = 0.1;
	this.fillSpeedIncrease = 0.00005;
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/toxicBarrel.svg");
}

ToxicBarrel.prototype = Object.create(Entity.prototype);

ToxicBarrel.prototype.draw = function(){
	this.sprite.draw();
}

ToxicBarrel.prototype.update = function(){
	this.addFluid(this.fillSpeed);
	this.fillSpeed += this.fillSpeedIncrease;
}

ToxicBarrel.prototype.removeFluid = function(amount){
	if(this.fluid < amount){
		var tmp = this.fluid;
		this.fluid = 0
		return tmp;
	}
	this.fluid -= amount;
	return amount;
}

ToxicBarrel.prototype.addFluid = function(amount){
	this.fluid += amount;
	if(this.fluid > this.MAXIMUM_FLUID)
		this.game.setGameOver();
}

ToxicBarrel.prototype.drawFluidFillText = function(){
	this.canvasContext.font = "18px Arial";
	this.canvasContext.fillText(Math.floor(this.fluid) + "/" + this.MAXIMUM_FLUID, 630, 40);
}