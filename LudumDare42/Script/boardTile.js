function BoardTile(context, position, tile){
	this.context = context;
	this.position = position;
	this.tile = tile;
	this.entities = [];
}

BoardTile.prototype.draw = function(){
	for(var i = 0; i < this.entities.length; i++){
		this.entities[i].draw();
	}
}

BoardTile.prototype.update = function(){
	var building = this.getBuilding();
	if(building != null)
		building.update();
}

BoardTile.prototype.addEntity = function(entity){
	this.entities.push(entity);
}

BoardTile.prototype.removeEntity = function(entity){
	var index = this.entities.indexOf(entity);
	if(index > -1)
		this.entities.splice(index, 1);
}

BoardTile.prototype.isSolid = function(){
	for(var i = 0; i < this.entities.length; i++){
		if(this.entities[i].solid)
			return true;
	}
	return false;
}

BoardTile.prototype.getBuilding = function(){
	for(var i = 0; i < this.entities.length; i++){
		return this.entities[i];
	}
	return null;
}