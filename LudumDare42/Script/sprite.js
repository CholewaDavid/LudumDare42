function Sprite(context, position, imageName){
	this.context = context;
	this.position = position;
	this.image = new Image();
	this.image.src = imageName;
}

Sprite.prototype.draw = function(){
	this.context.drawImage(this.image, this.position[0], this.position[1]);
}

Sprite.prototype.isLoaded = function(){
	return this.image.complete;
}