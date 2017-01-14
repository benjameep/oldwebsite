var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SHOW_GRID = false;
var GRID_THICKNESS = 0.05;
var game;

var high = {x:0, y:0};

class Game {
	constructor(){
		this.aliveCells = {};
		this.newFrame = {};
		this.clickMode = "edit";
		this.isPlaying = false;
	}
	isAlive(x,y,cells){
		if(!cells[x])
			return false;
		return Boolean(cells[x][y]);
	}
	birth(x,y,cells){
		if(!cells[x])
			cells[x] = {};
		cells[x][y] = true;
	}
	kill(x,y,cells){
		// if(cells[x] == undefined)
		// 	return;
		delete cells[x][y];
	}
	invert(x,y,cells){
		if(!cells[x])
			cells[x] = {};
		cells[x][y] = !cells[x][y];
	}
	countLiveNeigh(x,y,cells){
		// var total = 0;
		// for(var row = -1; row <= 1; row++){
		// 	for(var col = -1; col <= 1; col++){
		// 		if(this.isAlive(x+row,y+col,cells)){
		// 			total++;
		// 		}
		// 	}
		// }
		return ( 0 +
			this.isAlive(x-1,y-1,cells) + 
			this.isAlive(x-1,y,cells) + 
			this.isAlive(x-1,y+1,cells) + 

			this.isAlive(x,y-1,cells) + 
			this.isAlive(x,y+1,cells) + 

			this.isAlive(x+1,y-1,cells) + 
			this.isAlive(x+1,y,cells) + 
			this.isAlive(x+1,y+1,cells) 
		) 	
	}
	update(){
		this.newFrame = {};
		for(var x in this.aliveCells){
			for(var y in this.aliveCells[x]){
				if(this.aliveCells[x][y]){
					for(var row = -1; row <= 1; row++){
						for(var col = -1; col <= 1; col++){
							var numofLiveNeighbors = this.countLiveNeigh(x*1+row,y*1+col,game.aliveCells);
								if(numofLiveNeighbors == 3 || (row == 0 && col == 0 && numofLiveNeighbors == 2)){
								this.birth(x*1+row,y*1+col,this.newFrame);
							}
						}
					}
				}
			}
		}
		this.aliveCells = this.newFrame;
	}
}

var Grid = {
	offsetX: Math.floor(window.innerWidth / 2),
	offsetY: Math.floor(window.innerHeight / 2),
	gridSize: 15,
	draw: function() {
		ctx.beginPath();
		for(var x = this.offsetX % this.gridSize; x < canvas.width; x+= this.gridSize){
			ctx.moveTo(x,0);
			ctx.lineTo(x,canvas.height);
			}
		for(var y = this.offsetY % this.gridSize; y < canvas.height; y+= this.gridSize){
			ctx.moveTo(0,y);
			ctx.lineTo(canvas.width,y);
			}
		ctx.lineWidth = GRID_THICKNESS;
		ctx.stroke();
		},
	zoom: function(direction) {
		// pixel center - the grid pixel offset / gridSize
		var oldCenterGridX = ((canvas.width/2) - this.offsetX) / this.gridSize;
		var oldCenterGridY = ((canvas.height/2) - this.offsetY) / this.gridSize;
		if(direction == "in"){
			if(this.gridSize < 200){
				this.gridSize += 1//this.gridSize * 0.1;
			}
		} else if (this.gridSize > 1){ // add or subtract a percentage of the current
			this.gridSize -= 1//this.gridSize * 0.1;
		}
		var newCenterX = oldCenterGridX * this.gridSize + this.offsetX;
		var newCenterY = oldCenterGridY * this.gridSize + this.offsetY;
		var zoomOffsetX = newCenterX - canvas.width/2;
		var zoomOffsetY = newCenterY - canvas.height/2;
		this.offsetX = Math.floor(this.offsetX - zoomOffsetX);
		this.offsetY = Math.floor(this.offsetY - zoomOffsetY);
		this.gridSize = Math.floor(this.gridSize);
		}
}

function drawRect(x,y){
	// ctx.strokeRect(Grid.offsetX + Grid.gridSize * x, Grid.offsetY + Grid.gridSize * y, Grid.gridSize, Grid.gridSize);
	ctx.fillRect(Grid.offsetX + Grid.gridSize * x, Grid.offsetY + Grid.gridSize * y, Grid.gridSize, Grid.gridSize);
}

function canvasFillScreen() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function draw() {
	// clear screen
	ctx.clearRect(0,0,canvas.width,canvas.height);
	if(SHOW_GRID){ Grid.draw(); };

	// ctx.strokeStyle = 
	ctx.fillStyle = "#777";
	for(var x in game.aliveCells){
		for(var y in game.aliveCells[x]){
			if(game.aliveCells[x][y]){
				drawRect(x,y);
			}
		}
	}

	ctx.fillStyle = "#CCC";
	drawRect(high.x,high.y);
}

function init() {
	game = new Game();
	canvasFillScreen();
	draw();
};

/* Mouse Handlers */
{
	var mouseIsDown = false;
	var mouseDownX = 0;
	var mouseDownY = 0;
	var oldGridOffsetX = 0;
	var oldGridOffsetY = 0;
	window.onmousedown = function(Event){
		mouseIsDown = true;
		mouseDownX = Event.pageX;
		mouseDownY = Event.pageY;
		// and info for the moving grid feature
		oldGridOffsetX = Grid.offsetX;
		oldGridOffsetY = Grid.offsetY;
		if(game.clickMode == "edit"){
			// fancy math is to convert the pixel on the screen to a spot
			// on my grid. basically take the pixel cord - my offset / the size of the grid
			// then invert that cell
			game.invert(Math.floor((mouseDownX - Grid.offsetX)/Grid.gridSize),
				Math.floor((mouseDownY - Grid.offsetY)/Grid.gridSize),game.aliveCells);
			}
		}
	window.onmousemove = function(Event){  
		   if(mouseIsDown && game.clickMode == "move"){
				 Grid.offsetX = oldGridOffsetX + Event.pageX - mouseDownX;
				 Grid.offsetY = oldGridOffsetY + Event.pageY - mouseDownY;
	   } else {
		   high.x = Math.floor((Event.pageX - Grid.offsetX)/Grid.gridSize);
		   high.y = Math.floor((Event.pageY - Grid.offsetY)/Grid.gridSize);
	   }
	}
	window.onmouseup = function(){
		   mouseIsDown = false;
	}
 }

/* Keyboard Handler */
{
	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Should do nothing if the key event was already consumed.
			}
		// 187 +
		// 189 -
		// console.log(event.keyCode);

		switch(event.keyCode) {
			
			case 187:
			Grid.zoom("in");
			break;
			case 189:
			Grid.zoom("out");
			break;
			case 71:
			SHOW_GRID = !SHOW_GRID;
			break;
			case 65: // a
				high.x --;
				break;
			case 87: // w
				high.y --;
				break;
			case 68: // d
				high.x ++;
				break;
			case 83: // s
				high.y ++;
				break;
			case 37: // <-
				high.x --;
				game.invert(high.x,high.y,game.aliveCells);
				break;
			case 38: // ^
				high.y --;
				game.invert(high.x,high.y,game.aliveCells);
				break;
			case 39: // ->
				high.x ++;
				game.invert(high.x,high.y,game.aliveCells);
				break;
			case 40: // v
				high.y ++;
				game.invert(high.x,high.y,game.aliveCells);
				break;
			case 13: // enter
				game.isPlaying = !game.isPlaying;
				break;
			case 221: // ]
				game.update();
				break;
			case 32: // space
				game.clickMode = "move";
			break;
			default:
			return;
			}
		
		// Consume the event to avoid it being handled twice
		event.preventDefault();
		}, true);
	
	window.addEventListener("keyup", function (event) {
		//alert(event.keyCode);
		switch(event.keyCode) {
			case 32: // space
			game.clickMode = "edit";
			break;
			default:
			return;
			}
		
		// Consume the event to avoid it being handled twice
		event.preventDefault();
		}, true);
}

window.onresize = init;
init();

// Game loop
var FPS = 30;
setInterval(function(){
	if(game.isPlaying){game.update();}
	draw();
},1000/FPS)