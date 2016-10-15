var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SHOW_GRID = true;
var GRID_THICKNESS = 0.05;
var CELL_THICKNESS = 1;
var mainTessal;

var Grid = {
    offsetX: Math.floor(window.innerWidth / 2),
    offsetY: Math.floor(window.innerHeight / 2),
    gridSize: 25,
    init: function(){
    	this.offsetX = Math.floor(window.innerWidth / 2);
    	this.offsetY = Math.floor(window.innerHeight / 2);
    },
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
                this.gridSize += this.gridSize * 0.1;
                }
            } else if (this.gridSize > 1){ // add or subtract a percentage of the current
                this.gridSize -= this.gridSize * 0.1;
                }
        var newCenterX = oldCenterGridX * this.gridSize + this.offsetX;
        var newCenterY = oldCenterGridY * this.gridSize + this.offsetY;
        var zoomOffsetX = newCenterX - canvas.width/2;
        var zoomOffsetY = newCenterY - canvas.height/2;
        this.offsetX -= zoomOffsetX;
        this.offsetY -= zoomOffsetY;
        }
}

function Cell (thisX,thisY){
    this.x = thisX;
    this.y = thisY;
    this.pxLeft = Grid.offsetX + Grid.gridSize * this.x;
    this.pxTop = Grid.offsetY + Grid.gridSize * this.y;
    this.pxRight = this.pxLeft + Grid.gridSize;
    this.pxBottom = this.pxTop + Grid.gridSize;
    this.draw = function(){
        ctx.fillRect(Grid.offsetX + Grid.gridSize * this.x, 
        Grid.offsetY + Grid.gridSize * this.y, Grid.gridSize, Grid.gridSize);
    };
    this.drawTop = function(offsetX,offsetY){
    	ctx.beginPath();
		ctx.moveTo(this.pxLeft+offsetX,this.pxTop+offsetY);
		ctx.lineTo(this.pxRight+offsetX,this.pxTop+offsetY);
		ctx.lineWidth = CELL_THICKNESS;
		ctx.stroke();
    };
    this.drawLeft = function(offsetX,offsetY){
    	ctx.beginPath();
		ctx.moveTo(this.pxLeft+offsetX,this.pxTop+offsetY);
		ctx.lineTo(this.pxLeft+offsetX,this.pxBottom+offsetY);
		ctx.lineWidth = CELL_THICKNESS;
		ctx.stroke();
    };
    this.drawBottom = function(offsetX,offsetY){
    	ctx.beginPath();
		ctx.moveTo(this.pxLeft+offsetX,this.pxBottom+offsetY);
		ctx.lineTo(this.pxRight+offsetX,this.pxBottom+offsetY);
		ctx.lineWidth = CELL_THICKNESS;
		ctx.stroke();
    };
    this.drawRight = function(offsetX,offsetY){
    	ctx.beginPath();
		ctx.moveTo(this.pxRight+offsetX,this.pxTop+offsetY);
		ctx.lineTo(this.pxRight+offsetX,this.pxBottom+offsetY);
		ctx.lineWidth = CELL_THICKNESS;
		ctx.stroke();
    };
}

function Tessellation(width,height,vertShift,horzShift){
    this.cells = [];
    this.x;
    this.y;
    this.width = width;
    this.height = height;
    this.vertShift = vertShift;
    this.horzShift = horzShift;
    this.init = function(){
    	this.x = Math.floor(-this.width/2);
    	this.y = Math.floor(-this.height/2);
        for(var xi = this.x; xi < this.x+this.width; xi++){
            for(var yi = this.y; yi < this.y+this.height; yi++){
                this.cells.push(new Cell(xi,yi));
            }
        }
    };
    this.draw = function(){
    	for(var i = 0; i < this.cells.length; i++){
    		ctx.fillStyle = "#7ca6ea";
    		this.cells[i].draw();
    	}
    }
    this.drawOutline= function(offsetX,offsetY){
    	var pxOffsetX = offsetX*Grid.gridSize || 0;
    	var pxOffsetY = offsetY*Grid.gridSize || 0;
        for(var i = 0; i < this.cells.length; i++){
            if(this.getindex(new Cell(this.cells[i].x,this.cells[i].y-1)) == -1){
            	this.cells[i].drawTop(pxOffsetX,pxOffsetY);
            }
            if(this.getindex(new Cell(this.cells[i].x-1,this.cells[i].y)) == -1){
            	this.cells[i].drawLeft(pxOffsetX,pxOffsetY);
            }
            if(this.getindex(new Cell(this.cells[i].x,this.cells[i].y+1)) == -1){
            	this.cells[i].drawBottom(pxOffsetX,pxOffsetY);
            }
            if(this.getindex(new Cell(this.cells[i].x+1,this.cells[i].y)) == -1){
            	this.cells[i].drawRight(pxOffsetX,pxOffsetY);
            }
        }
    };
    this.fillBoard = function(){
    	// the number of cells from the middle of the screen to the edge of the grid
    	var offsetX = Math.ceil(Grid.offsetX/Grid.gridSize); 
    	var offsetY = Math.ceil(Grid.offsetY/Grid.gridSize);
    	
    	// the number of cells from the edge of the main tessel to the start of the repeating background
    	var x = -this.width*(Math.ceil(offsetX/this.width));
    	var y = -this.height*(Math.ceil(offsetY/this.height));
    	
    	// the number of tessalations displaying across the screen
    	var numCols = ((x*-1)/this.width) *2 +1;
    	var numRows = ((y*-1)/this.height) *2 +1;
    	
    	// did some math to adjust the x to the shifts
    	var totalHorzShift = -(((y*-1)/this.height)*this.horzShift)%this.width;
    	for(var r = 0; r < numRows; r++){
    		var totalVertShift = -(((x*-1)/this.width+1)*this.vertShift)%this.height;
    		for(var c = 0; c < numCols; c++){
    			totalVertShift = (totalVertShift + this.vertShift)%this.height;
    			this.drawOutline(x+(c*this.width)+totalHorzShift,y+(r*this.height)+totalVertShift);
    		}
    		totalHorzShift = (totalHorzShift + this.horzShift)%this.width;
    	}
    }
    this.getindex = function(cellWeAreTesting){
    	for(var i = 0; i < this.cells.length; i++){
    		if(cellWeAreTesting.x == this.cells[i].x &&
    		   cellWeAreTesting.y == this.cells[i].y){
    			return i;
    		}
    	}
    	return -1;
    };
    this.removeCell = function(cellToRemove){
    	var index = this.getindex(cellToRemove);
    	if(index == -1){return}
    	this.cells.splice(index,1);
    }
    this.toggle = function(cellToToggle){
    	var index = this.getindex(cellToToggle)
    	if(index != -1){
    		this.cells.splice(index,1);
    	}
    	else{
    		this.cells.push(cellToToggle);
    		console.log(Math.abs(cellToToggle.y - this.y));
    	}
    }
    
}

/* Mouse Handlers */
{
    var mouseIsDown = false;
    var mouseDownX = 0;
    var mouseDownY = 0;
    window.onmousedown = function(Event){
    	mouseIsDown = true;
        mouseDownX = Event.pageX;
        mouseDownY = Event.pageY;
        var cell = new Cell(Math.floor((mouseDownX - Grid.offsetX)/Grid.gridSize),
                Math.floor((mouseDownY - Grid.offsetY)/Grid.gridSize));
        mainTessal.toggle(cell);
        draw();
    };
    window.onmousemove = function(Event){  
    	if(mouseIsDown){
    		
    	}
    };
    window.onmouseup = function(){
    	mouseIsDown = false;
    };
 }

function draw() {
    // clear screen
    ctx.clearRect(0,0,canvas.width,canvas.height);
	Grid.draw();
	mainTessal.draw();
	mainTessal.fillBoard();
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Grid.init();
    mainTessal = new Tessellation(7,1,0,4);
    mainTessal.init();
    draw();
}

window.onresize = init;
init();