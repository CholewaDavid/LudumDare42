function UIBuilding(pos, image, context, price, id){
	this.SIZE = 40;
	this.OFFSET_GAME = 10;
	this.OFFSET_UI = 5;
	
	this.canvasContext = context;
	this.position = pos.slice();
	this.position[0] += (id-1) * this.SIZE + this.OFFSET_GAME + this.OFFSET_UI * (id-1);
	this.position[1] -= this.SIZE + this.OFFSET_GAME;
	this.sprite = new Sprite(context, this.position, image);
	
	this.id = id;
	this.price = price;
	this.active = false;
}

UIBuilding.prototype.draw = function(){
	if(this.active)
		this.canvasContext.fillStyle = "#FF0000";
	else
		this.canvasContext.fillStyle = "#00FF00";
	this.canvasContext.fillRect(this.position[0], this.position[1], this.SIZE, this.SIZE);
	this.sprite.draw();
	this.canvasContext.font = "10px Arial";
	this.canvasContext.fillStyle = "#000000";
	this.canvasContext.fillText(this.id, this.position[0], this.position[1]+10);
	this.canvasContext.fillText(this.price, this.position[0], this.position[1] + this.SIZE);
}