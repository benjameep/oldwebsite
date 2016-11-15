"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var SHOW_GRID = false;
var GRID_THICKNESS = 0.05;

var clickMode = "edit";
var isPlaying = false;
var aliveCells = [];
var neighborCells = [];
var newFrame = [];

var highlighted = new Cell(0,0,"highlighted");

var menu = {
    width : 300,
    height : 40,
    draw : function(){
        ctx.fillStyle = "#BBB";
        ctx.fillRect((canvas.width - this.width)/2,0,this.width,this.height);
    }
}

var Grid = {
    offsetX: window.innerWidth / 2,
    offsetY: window.innerHeight / 2,
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

//           f
var array = [new Cell(0,1),new Cell(0,7),new Cell(6,1),
             //            m
             new Cell(7,4),new Cell(7,9),new Cell(8,0),
             //                          b
             new Cell(9,6),new Cell(9,7),new Cell(9,8)];

function find(array,cellToFind){
    var frontEnd = 0;
    var backEnd = array.length;
    var middle = Math.floor(array.length/2);
    var emergencyStop = 0;
    var done = false;
    
    while(!done){
        console.log("f="+frontEnd+" m="+middle+" b="+backEnd);
        emergencyStop++;
        
        if(cellToFind.x < array[middle].x || 
           (cellToFind.x == array[middle].x && cellToFind.y < array[middle].y)){
            console.log(cellToFind.x+"."+cellToFind.y +" < "+
                       array[middle].x+"."+array[middle].y);
            backEnd = middle;
            middle = Math.floor((frontEnd + backEnd)/2);
        } else {
            console.log(cellToFind.x+"."+cellToFind.y +" >= "+
                       array[middle].x+"."+array[middle].y);
            frontEnd = middle;
            middle = Math.floor((frontEnd + backEnd)/2);
        }
        if(emergencyStop > 100 || frontEnd == middle){
            done = true;
        }
        if(array[middle].x == cellToFind.x){
            if(array[middle].y == cellToFind.y){
                done = true;
            }
        }
    }
    console.log("f="+frontEnd+" m="+middle+" b="+backEnd);
    
    if(frontEnd == middle){
//        console.log(frontEnd+" == "+middle);
//        if(cellToFind.x != array[0].x){
//            console.log(cellToFind.x +"!="+ array[0].x)
//            if(cellToFind.y != array[0].y){
//                console.log(cellToFind.y +"!="+ array[0].y)
//                return -1;
//            }
//        }
        return -1;
    }
    return middle;
}
console.log("= "+find(array,new Cell(7,9)));

function Cell (thisX,thisY,type = "normal"){
    this.x = thisX;
    this.y = thisY;
    this.type = type;
    this.hasBeenChecked = false;
    this.draw = function(){
        if(this.type == "normal"){
            ctx.fillStyle = "#777";
            drawRect(this.x,this.y);
        } else if(this.type == "highlighted"){
            if(this.isAlive()){
                ctx.fillStyle = "#AAA";
            } else {
                ctx.fillStyle = "#CCC";
            }
            drawRect(this.x,this.y);
        } else {
            ctx.fillStyle = "rgba(79,174,88,.3)";
            drawRect(this.x,this.y);
            }
    };
    this.goClockwise = function(pivot){
        if(this.y < pivot.y && this.x <= pivot.x){
            this.x++;
            } else if(this.x > pivot.x && this.y <= pivot.y){
                this.y++;
                } else if(this.y > pivot.y && this.x >= pivot.x){
                    this.x--;
                    } else {
                        this.y--;
                        }
        };
    this.goCounterClockwise = function(pivot){
        if(this.y > pivot.y && this.x <= pivot.x){
            this.x++;
            } else if(this.x < pivot.x && this.y <= pivot.y){
                this.y++;
                } else if(this.y < pivot.y && this.x >= pivot.x){
                    this.x--;
                    } else {
                        this.y--;
                        }
        };
    this.findIndex = function(){
        for(var i = 0; i < aliveCells.length;i++){
            if(aliveCells[i].x == this.x && 
              aliveCells[i].y == this.y){
                return i;
            }
        }
        return -1;
        };
    this.findIndexInNewFrame = function(){
        for(var i = 0; i < newFrame.length;i++){
            if(newFrame[i].x == this.x && 
              newFrame[i].y == this.y){
                return i;
            }
        }
        return -1;
        };
    this.isAlive = function(){
        if(this.findIndex() == -1){
            return false;
            }
        return true;
        };
    this.setAlive = function(){
        newFrame.push(this);
    };
    this.kill = function(){
        var index = this.findIndexInNewFrame();
        newFrame.splice(index,1);
        };
    this.invert = function(){
        if(this.isAlive()){
            aliveCells.splice(this.findIndex(),1);
        } else {
            aliveCells.push(this);
        }
        };
    this.isAlreadyANeighbor = function(){
        for(var i = 0; i < neighborCells.length; i++){
            if(neighborCells[i].x == this.x &&
                 neighborCells[i].y == this.y){
                return true;
                }
            }
        return false;
        };
}

function drawRect(x,y){
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
    
    for(var i = 0; i < aliveCells.length; i++){
        aliveCells[i].draw();
    }
    menu.draw();
    //for(var i = 0; i < neighborCells.length; i++){
    //neighborCells[i].draw();
    //}
    highlighted.draw();
}

function update() {
    neighborCells = [];
    
    newFrame = aliveCells.slice();
    // for each cell that is alive
    for(var i = 0; i < aliveCells.length; i++){
        // go around it counting it's live and dead neighbors
        var numofLiveNeighbors = 0;
        var neighborCell = new Cell(aliveCells[i].x-1,aliveCells[i].y-1);
        for(var n = 0; n < 8; neighborCell.goClockwise(aliveCells[i]),n++){
            if(neighborCell.isAlive()){
                numofLiveNeighbors++;
                } else if (neighborCell.isAlreadyANeighbor() == false){
                    neighborCells.push(new Cell(neighborCell.x,neighborCell.y,"neighbor"));
                    }
            }
        // following the Game Of Life rules
        if(numofLiveNeighbors < 2 || numofLiveNeighbors > 3){
            aliveCells[i].kill(newFrame);
            }
        }
    
    // now for each dead neighbor that we just found
    for(var i = 0; i < neighborCells.length; i++){
        
        // go around it's neighbors to see if they can come back from the dead
        var DeadsNumOfLiveNeighbors = 0;
        var neighborCell = new Cell(neighborCells[i].x-1,neighborCells[i].y-1);
        for(var n = 0; n < 8; neighborCell.goClockwise(neighborCells[i]),n++){
            if(neighborCell.isAlive()){
                DeadsNumOfLiveNeighbors++;
                }
            }
        // once again following all those rules
        if(DeadsNumOfLiveNeighbors == 3){
            new Cell(neighborCells[i].x,neighborCells[i].y).setAlive(newFrame);
            }
        }
    aliveCells = newFrame;
}

function init() {
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
        if(clickMode == "edit"){
            // fancy math is to convert the pixel on the screen to a spot
            // on my grid. basically take the pixel cord - my offset / the size of the grid
            // then invert that cell
            new Cell(Math.floor((mouseDownX - Grid.offsetX)/Grid.gridSize),
                Math.floor((mouseDownY - Grid.offsetY)/Grid.gridSize)).invert();
        }
        }
    window.onmousemove = function(Event){  
           if(mouseIsDown && clickMode == "move"){
                 Grid.offsetX = oldGridOffsetX + Event.pageX - mouseDownX;
                 Grid.offsetY = oldGridOffsetY + Event.pageY - mouseDownY;
       } else {
           highlighted.x = Math.floor((Event.pageX - Grid.offsetX)/Grid.gridSize);
           highlighted.y = Math.floor((Event.pageY - Grid.offsetY)/Grid.gridSize);
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
        
        //alert(event.keyCode);
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
                highlighted.x --;
                break;
            case 87: // w
                highlighted.y --;
                break;
            case 68: // d
                highlighted.x ++;
                break;
            case 83: // s
                highlighted.y ++;
                break;
            case 37: // <-
                highlighted.x --;
                new Cell(highlighted.x,highlighted.y).invert();
                break;
            case 38: // ^
                highlighted.y --;
                new Cell(highlighted.x,highlighted.y).invert();
                break;
            case 39: // ->
                highlighted.x ++;
                new Cell(highlighted.x,highlighted.y).invert();
                break;
            case 40: // v
                highlighted.y ++;
                new Cell(highlighted.x,highlighted.y).invert();
                break;
            case 13: // enter
            isPlaying = !isPlaying;
            break;
            case 32: // space
            clickMode = "move";
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
            clickMode = "edit";
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
    if(isPlaying){update();}
    draw();
},1000/FPS)