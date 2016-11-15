var screen = document.getElementById("canvas");
var ctx = screen.getContext("2d");

var HEIGHT = 48;
var WIDTH = Math.floor((HEIGHT*Math.sqrt(3))/2)

var hover;
var blocks = [];

// ctx.fillRect(0,0,WIDTH,HEIGHT)

class Cord
{
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

class Cell
{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
	top(){ 
		return new Point(this.x+(this.y%4==1),Math.floor(this.y/2)*2) 
	}
	middle(){ 
		return new Point(this.x+(this.y%4==3),Math.floor(this.y/2)*2+2) 
	}
	bottom(){ 
		return new Point(this.x+(this.y%4==1),Math.floor(this.y/2)*2+4) 
	}
	draw(){
		ctx.beginPath();
		ctx.moveTo(this.top().getPixel().x,this.top().getPixel().y);
		ctx.lineTo(this.middle().getPixel().x,this.middle().getPixel().y);
		ctx.lineTo(this.bottom().getPixel().x,this.bottom().getPixel().y);
		ctx.closePath();
		ctx.fill();
	}
}

class Point
{
    constructor(x,y){ this.x = x; this.y = y }
    getPixel(){ 
    	return new Cord( WIDTH*this.x*2+(WIDTH*(this.y%4==2)), Math.floor((this.y*HEIGHT)/4))
    }
    pTop(){ 
    	return new Point(this.x,this.y-4)
    }
    pBottom(){ 
    	return new Point(this.x,this.y+4) 
    }
    pLeftTop(){ 
    	return new Point(this.x+(this.y%4==2),this.y-2) 
    }
    pRightTop(){ 
    	return new Point(this.x-(this.y%4==0),this.y-2) 
    }
    pLeftBottom(){ 
    	return new Point(this.x+(this.y%4==2),this.y+2) 
    }
    pRightBottom(){ 
    	return new Point(this.x-(this.y%4==0),this.y+2) 
    }
    cLeftTop(){ 
    	return new Cell(this.x-(this.y%4==0),this.y+(this.y%4==0)-4) 
    }
    cLeftMiddle(){ 
    	return new Cell(this.x-(this.y%4==0), this.y+(this.y%4==0)-2) 
    }
    cLeftBottom(){ 
    	return new Cell(this.x-(this.y%4==0), this.y+(this.y%4==0)) 
    }
    cRightTop(){ 
    	return new Cell(this.x, this.y+(this.y%4==2)-4); 
    }
    cRightMiddle(){ 
    	return new Cell(this.x, this.y+(this.y%4==2)-2) 
    }
    cRightBottom(){ 
    	return new Cell(this.x, this.y+(this.y%4==2)) 
    }
    draw(){
        ctx.fillStyle = "#DDD"
	    this.cLeftTop().draw();
	    this.cRightTop().draw();
	    ctx.fillStyle = "#BBB"
		this.cLeftBottom().draw();
		this.cLeftMiddle().draw();
		ctx.fillStyle = "#999"
		this.cRightMiddle().draw();
		this.cRightBottom().draw();
    }
}

function getPoint(x,y)
{
    let colNum = Math.floor((x+WIDTH/2)/WIDTH);
    let isUp = colNum%2==0
    let col = Math.floor(colNum/2);
    let row = (Math.floor((y+(isUp*Math.floor(HEIGHT/2)))/HEIGHT)*2+!isUp)*2
    return new Point(col,row);
}

window.onmousemove = function(event){
    hover = getPoint(event.pageX,event.pageY);
    draw();
}

window.onclick = function(){
	var block = new Point(hover.x,hover.y);
	var isFound = false;
	for(var i = 0; i < blocks.length; i++){
		if(blocks[i].x == block.x && blocks[i].y == block.y)
		{
			blocks.splice(i,1);
		}
	}
	blocks.push(block)
}


function draw(){
    ctx.clearRect(0,0,screen.width,screen.height)
    
    for(var i = 0; i < blocks.length; i++){
    	blocks[i].draw()
    }
    hover.draw()
}

window.onresize = function(){
    screen.width = window.innerWidth
    screen.height = window.innerHeight
}

window.onload = function(){
    screen.width = window.innerWidth
    screen.height = window.innerHeight
}
