function Board(game, canvas, pos){
	this.canvas = canvas;
	this.game = game;
	this.pos = pos.slice();
	this.sizeX = 15;
	this.sizeY = 15;
	
	this.TILE_SIZE = 32;
	this.boardArray;
	
	this.createMap();
	this.posEnd = this.setPosEnd();
}

Board.prototype.convertPosToTile = function(posInput){
	var position = posInput.slice();
	return[Math.floor((position[0] - this.pos[0])/this.TILE_SIZE), Math.floor((position[1] - this.pos[1])/this.TILE_SIZE)];
}

Board.prototype.convertTileToPos = function(tileInput){
	var tile = tileInput.slice();
	return[tile[0] * this.TILE_SIZE + this.pos[0], tile[1] * this.TILE_SIZE + this.pos[1]];
}

Board.prototype.draw = function(){
	for(var i = 0; i < this.sizeX; i++){
		for(var j = 0; j < this.sizeY; j++){
			this.boardArray[i][j].draw();
		}
	}
}

Board.prototype.update = function(){
	for(var i = 0; i < this.sizeX; i++){
		for(var j = 0; j < this.sizeY; j++){
			this.boardArray[i][j].update();
		}
	}
}

Board.prototype.getTile = function(tile){
	if(tile[0] < 0 || tile[0] >= this.sizeX || tile[1] < 0 || tile[1] >= this.sizeY)
		return null;
	return this.boardArray[tile[0]][tile[1]];
}

//Calculates end of board in pixels
Board.prototype.setPosEnd = function(){
	var output = [0,0];
	output[0] = this.sizeX * this.TILE_SIZE + this.pos[0];
	output[1] = this.sizeY * this.TILE_SIZE + this.pos[1];
	return output;
}

//Calculates ends of given tile(x1, y1, x2, y2)
Board.prototype.getTileBox = function(tile){
	var output = [0,0,0,0];
	output[0] = tile[0] * this.TILE_SIZE + this.pos[0];
	output[1] = tile[1] * this.TILE_SIZE + this.pos[1];
	output[2] = (tile[0] + 1) * this.TILE_SIZE + this.pos[0];
	output[3] = (tile[1] + 1) * this.TILE_SIZE + this.pos[1];
	return output;
}

Board.prototype.createMap = function(map){
	this.boardArray = new Array(this.sizeX);
	for(var i = 0; i < this.sizeX; i++){
		this.boardArray[i] = new Array(this.sizeY);
		for(var j = 0; j < this.sizeY; j++){
			this.boardArray[i][j] = new BoardTile(this.canvas.getContext("2d"), this.convertTileToPos([i,j]), [i,j]);
		}
	}
}

Board.prototype.getPlayerSpawnTile = function(){
	var output = [0,0];
	output[0] = Math.floor(this.sizeX/2);
	output[1] = Math.floor(this.sizeY/2);
	return output;
}