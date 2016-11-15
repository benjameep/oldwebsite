let screen = document.getElementById("canvas");
let ctx = screen.getContext("2d");

var board;
var PROP_HEIGHT = 0.8 // % of gridsize*2
var PROP_BODY = 0.75 // % of gridsize
var PADDING = 0.07 // % of screen's height

class Board
{
    constructor(){
        screen.width = window.innerWidth
        screen.height = window.innerHeight
        let pad = screen.height*PADDING
        this.height = screen.width > screen.height*4/5 ? screen.height-pad : (screen.width-pad)*5/4
        this.width = screen.width > screen.height*4/5 ? (screen.height-pad)*4/5 : screen.width-pad
        this.x = (screen.width - this.width) / 2
        this.y = (screen.height - this.height) / 2
        this.gridSize = this.height/10
    }
    draw(){
        for(let row = 0; row < 4; row++)
        {
            for(let i = 0; i < 8; i++)
            {
                if((row==0 || row==3) && i >= 6)
                    "nope"
                else
                    new Property(row,i).draw()
            }
        }
    }
}

class Property
{
    constructor(rotation,num){
        this.height = board.gridSize * 2 * PROP_HEIGHT
        this.width = board.gridSize
        let block = board.gridSize*2;
        let rotateOffset = (this.height - this.width)/2 * (rotation%2)
        let negPropHeight = (board.gridSize*2-(board.gridSize*2*PROP_HEIGHT))
        this.x = board.x + rotateOffset + (block*3+negPropHeight)*(rotation==3) + block*(!rotation) + board.gridSize*num*(!(rotation%2))
        this.y = board.y - rotateOffset + block*(rotation%2) + (block*4+negPropHeight)*(!rotation) + board.gridSize*num*(rotation%2)
        this.rotation = rotation
        this.number = rotation*10 + num
    }
    draw(){
        ctx.save();
        ctx.translate( this.x+this.width/2, this.y+this.height/2 )
        ctx.rotate(this.rotation*Math.PI/2)
        // [0,0] is now in the middle of the rectangle
        ctx.fillStyle = "#DDD"
        ctx.lineWidth = board.gridSize*0.05
        ctx.fillRect( -this.width/2, -this.height/2, this.width,this.height)
        ctx.strokeRect( -this.width/2, -this.height/2, this.width,this.height)
        ctx.fillStyle = this.color(this.number)
        if(this.color(this.number))
        {
            ctx.fillRect( -this.width/2, -this.height/2, this.width,this.height*(1-PROP_BODY))
            ctx.strokeRect( -this.width/2, -this.height/2, this.width,this.height*(1-PROP_BODY))
        }
        ctx.restore();
    }
    color(){
        switch(this.number)
        {
            case 0:
            case 1:
            case 2:
                return "lightBlue"
            case 4:
            case 5:
                return "purple"
            case 10:
            case 11:
            case 12:
                return "orange"
            case 14:
            case 15:
            case 17:
                return "violet"
            case 20:
            case 21:
            case 22:
                return "red"
            case 24:
            case 25:
            case 27:
                return "yellow"
            case 30:
            case 31:
            case 32:
                return "green"
            case 34:
            case 35:
                return "blue"
            default:
                return ""
        }
    }
}

function whichProp(mX,mY)
{
	let x = Math.floor((mX-board.x)/(board.gridSize/2));
	let y = Math.floor((mY-board.y)/(board.gridSize/2));
	if(x<8 && x>=0 && y>=0 && y<10)
	{
		if(x>=2 && y>=8){
			return x-2
		} else if(x<2 && y>=2){
			return 10+y-2
		} else if(y<2){
			return 20+x
		} else if(x>=6 && y>=2 && y<8){
			return 30+x
		}
	}
	return -1;
}

window.onresize = function(){
    board = new Board();
    board.draw();
}
window.onload = function(){
    board = new Board();
    board.draw();
}