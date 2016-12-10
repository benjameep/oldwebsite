let screen = document.getElementById("canvas");
let ctx = screen.getContext("2d");

var board
var game
var PROP_HEIGHT = 0.8 // % of gridsize*2
var PROP_BODY = 0.75 // % of gridsize
var PADDING = 0.07 // % of screen's height
const data = JSON.parse('{"0":{"Bros":["1","2"],"Name":"Connecticut Avenue","Short":{"0":"0.3681","1":"0.9201","2":"2.3003","3":"6.9010","4":"10.3515","5":"13.8020","Single":"0.1840"},"Long":{"0":"0.3469","1":"0.8672","2":"2.1680","3":"6.5041","4":"9.7561","5":"13.0082","Single":"0.1734"}},"1":{"Bros":["2","0"],"Name":"Vermont Avenue","Short":{"0":"0.2785","1":"0.6963","2":"2.0889","3":"6.2666","4":"9.2839","5":"12.7653","Single":"0.1393"},"Long":{"0":"0.2625","1":"0.6562","2":"1.9686","3":"5.9058","4":"8.7494","5":"12.0304","Single":"0.1312"}},"2":{"Bros":["1","0"],"Name":"Oriental Avenue","Short":{"0":"0.2715","1":"0.6786","2":"2.0359","3":"6.1078","4":"9.0486","5":"12.4418","Single":"0.1357"},"Long":{"0":"0.2558","1":"0.6395","2":"1.9185","3":"5.7556","4":"8.5268","5":"11.7243","Single":"0.1279"}},"3":{"Bros":["13","23","33"],"Name":"Reading Railroad","Short":{"0":"0.8130","1":"1.6261","2":"3.2521","3":"6.5043"},"Long":{"0":"0.7682","1":"1.5365","2":"3.0730","3":"6.1459"}},"4":{"Bros":["5"],"Name":"Baltic Avenue","Short":{"0":"0.1730","1":"0.4325","2":"1.2974","3":"3.8923","4":"6.9197","5":"9.7308","Single":"0.0865"},"Long":{"0":"0.1630","1":"0.4074","2":"1.2221","3":"3.6664","4":"6.5181","5":"9.1661","Single":"0.0815"}},"5":{"Bros":["4"],"Name":"Mediterranean Avenue","Short":{"0":"0.0853","1":"0.2131","2":"0.6394","3":"1.9182","4":"3.4102","5":"5.3284","Single":"0.0426"},"Long":{"0":"0.0803","1":"0.2007","2":"0.6022","3":"1.8066","4":"3.2117","5":"5.0183","Single":"0.0401"}},"10":{"Bros":["11","12"],"Name":"New York Avenue","Short":{"0":"0.9873","1":"2.4681","2":"6.7874","3":"18.5110","4":"24.6814","5":"30.8517","Single":"0.4936"},"Long":{"0":"0.8998","1":"2.2494","2":"6.1859","3":"16.8707","4":"22.4942","5":"28.1178","Single":"0.4499"}},"11":{"Bros":["12","10"],"Name":"Tennessee Avenue","Short":{"0":"0.8220","1":"2.0549","2":"5.8712","3":"16.1457","4":"22.0169","5":"27.8880","Single":"0.4110"},"Long":{"0":"0.7899","1":"1.9747","2":"5.6421","3":"15.5157","4":"21.1578","5":"26.7999","Single":"0.3949"}},"12":{"Bros":["11","10"],"Name":"St. James Place","Short":{"0":"0.7819","1":"1.9547","2":"5.5848","3":"15.3583","4":"20.9431","5":"26.5279","Single":"0.3909"},"Long":{"0":"0.7505","1":"1.8761","2":"5.3604","3":"14.7411","4":"20.1015","5":"25.4619","Single":"0.3752"}},"13":{"Bros":["3","23","33"],"Name":"Pennsylvania Railroad","Short":{"0":"0.8021","1":"1.6041","2":"3.2083","3":"6.4165"},"Long":{"0":"0.7268","1":"1.4535","2":"2.9070","3":"5.8140"}},"14":{"Bros":["15","17"],"Name":"Virginia Avenue","Short":{"0":"0.5916","1":"1.4789","2":"4.4368","3":"12.3245","4":"17.2542","5":"22.1840","Single":"0.2958"},"Long":{"0":"0.5821","1":"1.4553","2":"4.3660","3":"12.1277","4":"16.9788","5":"21.8298","Single":"0.2911"}},"15":{"Bros":["14","17"],"Name":"States Avenue","Short":{"0":"0.4744","1":"1.1860","2":"3.5581","3":"10.6744","4":"14.8256","5":"17.7907","Single":"0.2372"},"Long":{"0":"0.4348","1":"1.0870","2":"3.2611","3":"9.7833","4":"13.5879","5":"16.3054","Single":"0.2174"}},"16":{"Bros":["26"],"Name":"Electric Company","Short":{"0":"0.7189","1":"1.7972"},"Long":{"0":"0.6903","1":"1.7258"}},"17":{"Bros":["15","14"],"Name":"St. Charles Place","Short":{"0":"0.5403","1":"1.3508","2":"4.0525","3":"12.1575","4":"16.8854","5":"20.2624","Single":"0.2702"},"Long":{"0":"0.5112","1":"1.2780","2":"3.8339","3":"11.5018","4":"15.9747","5":"19.1697","Single":"0.2556"}},"20":{"Bros":["21","22"],"Name":"Kentucky Avenue","Short":{"0":"1.0209","1":"2.5523","2":"7.0896","3":"19.8509","4":"24.8137","5":"29.7764","Single":"0.5105"},"Long":{"0":"0.9411","1":"2.3528","2":"6.5356","3":"18.2998","4":"22.8748","5":"27.4497","Single":"0.4706"}},"21":{"Bros":["22","20"],"Name":"Indiana Avenue","Short":{"0":"0.9848","1":"2.4621","2":"6.8392","3":"19.1498","4":"23.9373","5":"28.7248","Single":"0.4924"},"Long":{"0":"0.9241","1":"2.3104","2":"6.4177","3":"17.9696","4":"22.4620","5":"26.9544","Single":"0.4621"}},"22":{"Bros":["21","20"],"Name":"Illinois Avenue","Short":{"0":"1.2743","1":"3.1858","2":"9.5573","3":"23.8932","4":"29.4683","5":"35.0434","Single":"0.6372"},"Long":{"0":"1.1972","1":"2.9929","2":"8.9788","3":"22.4470","4":"27.6846","5":"32.9223","Single":"0.5986"}},"23":{"Bros":["3","13","33"],"Name":"B & O Railroad","Short":{"0":"0.8538","1":"1.7076","2":"3.4152","3":"6.8304"},"Long":{"0":"0.8103","1":"1.6207","2":"3.2413","3":"6.4827"}},"24":{"Bros":["25","27"],"Name":"Atlantic Avenue","Short":{"0":"1.1912","1":"2.9779","2":"8.9338","3":"21.6576","4":"26.3952","5":"31.1328","Single":"0.5956"},"Long":{"0":"1.1163","1":"2.7907","2":"8.3721","3":"20.2960","4":"24.7357","5":"29.1754","Single":"0.5581"}},"25":{"Bros":["24","27"],"Name":"Ventnor Avenue","Short":{"0":"1.1787","1":"2.9467","2":"8.8402","3":"21.4309","4":"26.1189","5":"30.8069","Single":"0.5893"},"Long":{"0":"1.1084","1":"2.7710","2":"8.3131","3":"20.1530","4":"24.5615","5":"28.9700","Single":"0.5542"}},"26":{"Bros":["16"],"Name":"Water Works","Short":{"0":"0.7939","1":"1.9849"},"Long":{"0":"0.7507","1":"1.8768"}},"27":{"Bros":["25","24"],"Name":"Marvin Gardens","Short":{"0":"1.2413","1":"3.1033","2":"9.3098","3":"21.9814","4":"26.5070","5":"31.0326","Single":"0.6207"},"Long":{"0":"1.1703","1":"2.9258","2":"8.7773","3":"20.7241","4":"24.9909","5":"29.2576","Single":"0.5852"}},"30":{"Bros":["31","32"],"Name":"Pacific Avenue","Short":{"0":"1.3922","1":"3.4806","2":"10.4417","3":"24.0963","4":"29.4511","5":"34.1365","Single":"0.6961"},"Long":{"0":"1.3123","1":"3.2807","2":"9.8422","3":"22.7127","4":"27.7600","5":"32.1764","Single":"0.6561"}},"31":{"Bros":["30","32"],"Name":"North Carolina Avenue","Short":{"0":"1.3651","1":"3.4127","2":"10.2382","3":"23.6266","4":"28.8769","5":"33.4710","Single":"0.6825"},"Long":{"0":"1.2855","1":"3.2137","2":"9.6412","3":"22.2490","4":"27.1933","5":"31.5195","Single":"0.6427"}},"32":{"Bros":["31","30"],"Name":"Pennsylvania Avenue","Short":{"0":"1.4004","1":"3.7509","2":"11.2528","3":"25.0063","4":"30.0075","5":"35.0088","Single":"0.7002"},"Long":{"0":"1.3177","1":"3.5296","2":"10.5889","3":"23.5308","4":"28.2370","5":"32.9431","Single":"0.6589"}},"33":{"Bros":["3","13","23"],"Name":"Short Line","Short":{"0":"0.6082","1":"1.2163","2":"2.4326","3":"4.8653"},"Long":{"0":"0.5726","1":"1.1453","2":"2.2906","3":"4.5811"}},"34":{"Bros":["35"],"Name":"Park Place","Short":{"0":"1.5305","1":"3.8262","2":"10.9320","3":"24.0504","4":"28.4232","5":"32.7960","Single":"0.7652"},"Long":{"0":"1.4417","1":"3.6042","2":"10.2976","3":"22.6547","4":"26.7738","5":"30.8928","Single":"0.7208"}},"35":{"Bros":["34"],"Name":"Boardwalk","Short":{"0":"2.6260","1":"5.2519","2":"15.7558","3":"36.7635","4":"44.6414","5":"52.5193","Single":"1.3130"},"Long":{"0":"2.4832","1":"4.9664","2":"14.8992","3":"34.7647","4":"42.2143","5":"49.6639","Single":"1.2416"}}}')


class Board{
    
    constructor(){
        screen.width = window.innerWidth
        screen.height = window.innerHeight
        let pad = screen.height*PADDING
        this.height = screen.width > screen.height*4/5 ? screen.height-pad : (screen.width-pad)*5/4
        this.width = screen.width > screen.height*4/5 ? (screen.height-pad)*4/5 : screen.width-pad
        this.x = (screen.width - this.width) / 2
        this.y = (screen.height - this.height) / 2
        this.gridSize = this.height/10
        this.props = {}
    }
    initProps(){
        for(let row = 0; row < 4; row++){
            for(let i = 0; i < 8; i++){
                if(!((row==0 || row==3) && i >= 6))
                    this.props[row*10+i] = new Property(row,i)
            }
        }
    }
    draw(){
        for(let key in this.props)
            this.props[key].draw()
    }
}

class Property{
    
    constructor(rotation,num){
        this.height = board.gridSize * 2 * PROP_HEIGHT
        this.width = board.gridSize
        let block = board.gridSize*2;
        let rotateOffset = (this.height - this.width)/2 * (rotation%2)
        let negPropHeight = (board.gridSize*2-(board.gridSize*2*PROP_HEIGHT))
        this.x = board.x + rotateOffset + (block*3+negPropHeight)*(rotation==3) + block*(!rotation) + board.gridSize*num*(!(rotation%2))
        this.y = board.y - rotateOffset + block*(rotation%2) + (block*4+negPropHeight)*(!rotation) + board.gridSize*num*(rotation%2)
        this.rotation = rotation
        this.id = rotation*10 + num
        this.data = data[this.id]
        this.dev = "Single"
        this.color = this.getColor()
        this.monop = this.getMonop()
    }
    draw(offx=0,offy=0,rotate=true,grow=1){
        ctx.save();
        ctx.translate( this.x+offx+this.width/2, this.y+offy+this.height/2 )
        if(rotate)
            ctx.rotate(this.rotation*Math.PI/2)
        // [0,0] is now in the middle of the rectangle
        ctx.fillStyle = "#EEE"
        ctx.strokeStyle = "#000";
        let chg = {width:this.width*grow, height:this.height*grow}
        ctx.lineWidth = board.gridSize*0.05*grow
        ctx.fillRect( -chg.width/2, -chg.height/2, chg.width,chg.height)
        ctx.strokeRect( -chg.width/2, -chg.height/2, chg.width,chg.height)
        if(this.color)
        {
            ctx.fillStyle = this.color
            ctx.fillRect( -chg.width/2, -chg.height/2, chg.width,chg.height*(1-PROP_BODY))
            ctx.strokeRect( -chg.width/2, -chg.height/2, chg.width,chg.height*(1-PROP_BODY))
        }
        ctx.restore();
    }
    drawIcon(x,y,num){
        let size = board.gridSize*.25
        ctx.lineWidth = board.gridSize*0.05*.4
        var topY = y
        for(var i = 0; i < num; i++, y = topY + i*size*.35){
            ctx.fillStyle = "#EEE"
            ctx.fillRect(x,y,size,size)
            ctx.strokeRect(x,y,size,size)
            if(this.color){
                ctx.fillStyle = this.color
                ctx.fillRect(x,y,size,size*.4)
                ctx.strokeRect(x,y,size,size*.4)
            }
        }
    }
    getColor(){
        switch(this.id)
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
    getMonop(){
        switch(this.id)
        {
            case 0:
            case 1:
            case 2:
                return 1
            case 4:
            case 5:
                return 0
            case 10:
            case 11:
            case 12:
                return 3
            case 14:
            case 15:
            case 17:
                return 2
            case 20:
            case 21:
            case 22:
                return 4
            case 24:
            case 25:
            case 27:
                return 5
            case 30:
            case 31:
            case 32:
                return 6
            case 34:
            case 35:
                return 7
            case 3:
            case 13:
            case 23:
            case 33:
                return 8
            case 16:
            case 26:
                return 9
            default:
                return -1
        }
    }
}

class Player{
    
    constructor(number,numPlayers,color){
        this.color = color || "#999"
        this.number = number
        this.initPosition(numPlayers)
        this.props = {}
        this.balance = 0;
        this.value = 0;
        this.monops = [{amount:0},{amount:0},{amount:0},{amount:0},{amount:0},{amount:0},{amount:0},{amount:0},{amount:0},{amount:0}]
    }
    initPosition(numPlayers){
        let margin = board.gridSize*0.07
        let block = board.gridSize*2
        let colNum = numPlayers > 3 ? this.number%2 : 0
        let rowNum = numPlayers < 4 ? this.number : Math.floor(this.number/2)
        this.width = block+block*(numPlayers < 4)
        this.height = block + board.gridSize*(numPlayers==2||numPlayers==4)
        this.x = board.x + block + this.width*colNum + margin
        this.y = board.y + block + this.height*rowNum + margin
        this.width -= margin*2
        this.height -= margin*2
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y,this.width,this.height)
        ctx.lineWidth = board.gridSize*0.05
        ctx.strokeStyle = "#000"
        ctx.strokeRect(this.x,this.y,this.width,this.height)
        ctx.fillStyle = "#FFF"
        ctx.textAlign = "center"
        ctx.font = "30px Arial"
        ctx.textBaseline = "middle"
        ctx.fillText(this.balance.toFixed(1),this.x+this.width/2,this.y+this.height/2)
        this.drawProps()
    }
    drawProps(){
        let numMonops = 0
        for(var i = 0; i < this.monops.length; i++){
            if(this.monops[i].amount)
                numMonops++
        }
        let iconSize = board.gridSize*.25
        let padding = (this.width*.85 - iconSize*(numMonops > 5 ? numMonops : 5))/((numMonops > 5 ? numMonops : 5)+1)
        console.log(iconSize,numMonops*(iconSize+padding))
        let x = this.x + (this.width - numMonops*(iconSize) - (numMonops-1)*(padding))/2
        let y = this.y + this.height*.70
        for(var i = 0; i < this.monops.length; i++){
            if(this.monops[i].amount > 0){
                this.monops[i].prop.drawIcon(x,y,this.monops[i].amount)
                x += padding + iconSize
            }
        }
    }
    addProp(id){
        if(!this.props[id]){ // if it dosen't have it already
            this.props[id] = board.props[id]
            let hasMonopoly = true
            for(let i = 0; i < data[id].Bros.length; i++){
                if(!this.props[data[id].Bros[i]])
                    hasMonopoly = false
            }
            if(hasMonopoly){
                this.props[id].dev = 0
                for(let i = 0; i < data[id].Bros.length; i++)
                    this.props[data[id].Bros[i]].dev = 0
            }
            this.updateValue()
            this.monops[this.props[id].monop].amount++
            this.monops[this.props[id].monop].prop = this.props[id]
        }
    }
    removeProp(id){
        this.monops[this.props[id].monop].amount--
        for(let i = 0; i < data[id].Bros.length; i++){
            if(this.props[data[id].Bros[i]])
                this.props[data[id].Bros[i]].dev = "Single"
        }
        this.props[id].dev = "Single"
        delete this.props[id];
        this.updateValue()
    }
    updateValue(){
        this.value = 0
        for(let prop in this.props){
            if(prop%10!=3&&prop%10!=6) // if it is not a railroad or utility
                this.value += parseFloat(data[prop].Short[this.props[prop].dev])
            else{
                let numBros = 0
                for(let i = 0; i < data[prop].Bros.length; i++)
                    numBros += Boolean(this.props[data[prop].Bros[i]])
                this.value += parseFloat(data[prop].Short[numBros])
            }
        }
    }
}

class Game{
    constructor(numPlayers){
        this.players = []
        for(let i = 0; i < numPlayers; i++)
            this.players[i] = new Player(i,numPlayers)
    }
    draw(){
        for(let i = 0; i < this.players.length; i++)
            this.players[i].draw()
    }
    resize(){
        for(let i = 0; i < this.players.length; i++)
            this.players[i].initPosition(this.players.length)
    }
    whichPlayer(mX,mY){
        // if mouse is outside of the middle of the board
        if(mX > board.x+board.gridSize*6 || mX < board.x+board.gridSize*2 ||
            mY > board.y+board.gridSize*8 || mY < board.y+board.gridSize*2)
            return -1
        let x = Math.floor((mX-board.x-board.gridSize*2)/(this.players[0].width))
        let y = Math.floor((mY-board.y-board.gridSize*2)/(this.players[0].height))
        let player = this.players.length < 4 ? y : x+y*2
        if(player >= 0 && player < this.players.length)
            return player
        else
            return -1
    }
    addProp(player,prop){
        if(this.players[player].props[prop]) // if it already has it
            return
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].props[prop])
                this.players[i].removeProp(prop)
        }
        this.players[player].addProp(prop)
        this.updateBalance()
    }
    updateBalance(){
        let total = 0
        for(let i = 0; i < this.players.length; i++)
            total += this.players[i].value
        for(let i = 0; i < this.players.length; i++)
            this.players[i].balance = this.players[i].value*this.players.length - total
        DRAW()
    }
}

function whichProp(mX,mY){
	let x = Math.floor((mX-board.x)/(board.gridSize));
	let y = Math.floor((mY-board.y)/(board.gridSize));
	if(x<8 && x>=0 && y>=0 && y<10)
	{
		if(x>=2 && y>=8)
			return x-2
		else if(x<2 && y>=2)
			return 10+y-2
		else if(y<2)
			return 20+x
		else if(x>=6 && y>=2 && y<8)
			return 30+y-2
	}
	return -1;
}

/* MOUSE HANDLERS */ 
{
    let mouseIsDown = false
    let start = { x:0, y:0 }
    let prop = -1
    window.onmousedown = function(e)
    {
        prop = whichProp(e.pageX,e.pageY)
        if(prop != -1)
        {
            mouseIsDown = true
            start.x = e.pageX
            start.y = e.pageY
        }
    }
    window.onmousemove = function(e)
    {
        if(mouseIsDown)
        {
            DRAW()
            let dragProp = board.props[prop];
            dragProp.draw(e.pageX-start.x,e.pageY-start.y,0,1)
        }
    }
    window.onmouseup = function(e)
    {
        let player = game.whichPlayer(e.pageX,e.pageY)
        DRAW()
        if(mouseIsDown && player != -1)
            game.addProp(player,prop)
        mouseIsDown = false
    }
}

function DRAW(){
    ctx.fillStyle = "#444";
    ctx.fillRect(0,0,screen.width,screen.height)
    board.draw()
    game.draw()

}

window.onresize = function(){
    board = new Board()
    board.initProps()
    game.resize()
    DRAW()
}
window.onload = function(){
    board = new Board()
    game = new Game(4)
    board.initProps()
    DRAW()
}