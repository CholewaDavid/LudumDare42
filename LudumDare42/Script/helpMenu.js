function HelpMenu(canvas){
	this.canvas = canvas;
	this.buttons = [];
	this.fillButtons();
	this.activeButtonIndex = 0;
	this.helpTextSprite = new Sprite(this.canvas.getContext("2d"), [0,0], "Images/helpText.svg");
	this.background = new Sprite(this.canvas.getContext("2d"), [0,0], "Images/helpBackground.svg");
	this.showingBuildingsInfo = false;
}

HelpMenu.prototype.draw = function(){
	game.draw();
	this.background.draw();
	this.helpTextSprite.draw();
	for(var i = 0; i < this.buttons.length; i++){
		if(this.showingBuildingsInfo && i == 1)
			continue;
		this.buttons[i].draw();
	}
}

HelpMenu.prototype.changeMenuItem = function(dir){
	if(this.showingBuildingsInfo)
		return;
	this.buttons[this.activeButtonIndex].active = false;
	this.activeButtonIndex += dir;
	if(this.activeButtonIndex < 0)
		this.activeButtonIndex = this.buttons.length - 1;
	else if(this.activeButtonIndex >= this.buttons.length)
		this.activeButtonIndex = 0;
	this.buttons[this.activeButtonIndex].active = true;
	this.draw();
}

HelpMenu.prototype.activateButton = function(){
	switch(this.activeButtonIndex){
		case 0:
			if(this.showingBuildingsInfo){
				var img = new Image();
				img.src = "Images/helpText.svg";
				this.helpTextSprite.image = img;
				this.showingBuildingsInfo = false;
			}
			else
				this.leavePage();
			break;
		case 1:
			var img = new Image();
			img.src = "Images/helpBuildings.svg";
			this.helpTextSprite.image = img;
			this.changeMenuItem(-1);
			this.showingBuildingsInfo = true;
			break;
	}
}

HelpMenu.prototype.fillButtons = function(){
	this.buttons.push(new Button(this.canvas.getContext("2d"), [500,400], "Images/Buttons/back.svg", "Images/Buttons/backActive.svg"));
	this.buttons.push(new Button(this.canvas.getContext("2d"), [500,500], "Images/Buttons/buildingsInfo.svg", "Images/Buttons/buildingsInfoActive.svg"));
	
	this.buttons[0].active = true;
}

HelpMenu.prototype.leavePage = function(){
	entryMenu.showingHelp = false;
	entryMenu.draw();
	this.activeButtonIndex = 0;
}