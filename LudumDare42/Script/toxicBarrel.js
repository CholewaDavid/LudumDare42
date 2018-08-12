function ToxicBarrel(game, canvasContext, pos){
	Entity.call(this, game, canvasContext, pos, false);
	
	this.MAXIMUM_FLUID = 1000;
	this.fluid = 0;
	this.fillSpeed = 0.1;
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/toxicBarrel.svg");
}

ToxicBarrel.prototype = Object.create(Entity.prototype);

ToxicBarrel.prototype.draw = function(){
	this.sprite.draw();
	this.drawFluidFillText();
}

ToxicBarrel.prototype.update = function(){
	this.addFluid(this.fillSpeed);
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
	this.canvasContext.font = "20px Arial";
	this.canvasContext.fillText(Math.floor(this.fluid) + "/" + this.MAXIMUM_FLUID, this.position[0] + 100, this.position[1]);
}