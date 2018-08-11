function HelpMenu(canvas){
	this.canvas = canvas;
	this.buttons = [];
	this.fillButtons();
	this.activeButtonIndex = 0;
	this.helpTextSprite = new Sprite(this.canvas.getContext("2d"), [225,200], "Images/helpText.svg");
}

HelpMenu.prototype.draw = function(){
	game.draw();
	this.helpTextSprite.draw();
	for(var i = 0; i < this.buttons.length; i++)
		this.buttons[i].draw();
}

HelpMenu.prototype.changeMenuItem = function(dir){
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
			this.leavePage();
			break;
	}
}

HelpMenu.prototype.fillButtons = function(){
	this.buttons.push(new Button(this.canvas.getContext("2d"), [80,500], "Images/Buttons/back.svg", "Images/Buttons/backActive.svg"));
	
	this.buttons[0].active = true;
}

HelpMenu.prototype.leavePage = function(){
	entryMenu.showingHelp = false;
	entryMenu.draw();
	this.activeButtonIndex = 0;
}