function TransmitionTower(game, canvasContext, tile){
	Entity.call(this, game, canvasContext, game.board.convertTileToPos(tile), true);
	
	this.RANGE = 5;
	this.tile = tile.slice();
	this.sprite = new Sprite(this.canvasContext, this.position, "Images/transmitionTower.svg");
	this.powerWarningSprite = new Sprite(this.canvasContext, this.position, "Images/noPower.svg");
	this.connected = false;
	this.connectedBuildings = [];
	this.findPower();
}

TransmitionTower.prototype = Object.create(Entity.prototype);

TransmitionTower.prototype.draw = function(){
	this.sprite.draw();
	
	for(var i = 0; i < this.connectedBuildings.length; i++){
		var posA = this.position.slice();
		posA[0] += this.sprite.image.width/2;
		
		var posB =  this.connectedBuildings[i].position.slice();
		posB[0] += this.connectedBuildings[i].sprite.image.width/2;
		
		this.canvasContext.beginPath();
		this.canvasContext.moveTo(posA[0], posA[1]);
		this.canvasContext.lineTo(posB[0], posB[1]);
		this.canvasContext.stroke();
	}
}

TransmitionTower.prototype.update = function(){
	if(!this.connected)
		this.findPower();
}

TransmitionTower.prototype.checkConnectivity = function(){
	if(!this.connected)
		return;
	for(var i = -this.RANGE; i <= this.RANGE; i++){
		for(var j = -(this.RANGE - Math.abs(i)); j < this.RANGE - Math.abs(i); j++){
			if(i == 0 && j == 0)
				continue;
			var pos = [this.tile[0] + i, this.tile[1] + j];
			var tile = this.game.board.getTile(pos);
			if(tile == null)
				continue;
			
			var building = tile.getBuilding();
			if(building == null)
				continue;
			if(this.connectedBuildings.indexOf(building) != -1)
				continue;
			
			if(building instanceof Transformer){
				if(building.connected)
					continue;
				this.connectedBuildings.push(building);
				building.connected = true;
			}
			else if(building instanceof TransmitionTower){
				if(building.connectedBuildings.indexOf(this) == -1)
					this.connectedBuildings.push(building);
				if(!building.connected){
					building.connected = true;
					building.checkConnectivity();
				}
			}
			else if(building instanceof PowerStation)
				this.connectedBuildings.push(building);
		}
	}
}

TransmitionTower.prototype.findPower = function(){
	for(var i = -this.RANGE; i <= this.RANGE; i++){
		for(var j = -(this.RANGE - Math.abs(i)); j < this.RANGE - Math.abs(i); j++){
			if(i == 0 && j == 0)
				continue;
			var pos = [this.tile[0] + i, this.tile[1] + j];
			var tile = this.game.board.getTile(pos);
			if(tile == null)
				continue;
			var building = tile.getBuilding();
			if(building == null)
				continue;
			else if(building instanceof TransmitionTower && building.connected){
				if(building.connectedBuildings.indexOf(this) == -1)
					this.connectedBuildings.push(building);
				this.connected = true;
				this.checkConnectivity();
				return;
			}
			else if(building instanceof PowerStation){
				this.connectedBuildings.push(building);
				this.connected = true;
				this.checkConnectivity();
				return;
			}
		}
	}
}

TransmitionTower.prototype.showWarning = function(){
	if(!this.connected)
		this.powerWarningSprite.draw();
}