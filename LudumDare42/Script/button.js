function Button(context, position, imageNameA, imageNameB, angle){
	this.spriteInactive = new Sprite(context, position, imageNameA, angle);
	this.spriteActive = new Sprite(context, position, imageNameB, angle);
	this.active = false;
}

Button.prototype.draw = function(){
	if(this.active)
		this.spriteActive.draw();
	else
		this.spriteInactive.draw();
}