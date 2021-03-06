"use strict"; //strict mode
var gameWidth=5; //width of the game canvas
var gameHeight=6; //height of the game canvas
function enemyInitialX(direction){ //starting x differs depending on the direction of the movement.
    if(direction ==1) {
        return Math.round(-1-Math.random()); //rock start somewhere completely off the screen
    } 
    else {
        return Math.round(5+Math.random()); //rock start somewhere completely off the screen
    }
}
function enemyInitialY(){return Math.round((2*Math.random()+1));} //initial y position can only be between 1, 2, or 3
function randomSpeed(){return Math.random()*3+2;} //set a random speed
function randomDirection(){return Math.round(Math.random())*2-1;} //set a direction. 1 for going right, -1 for going left.

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.direction = randomDirection(); //randome direction
    this.x =enemyInitialX(this.direction); //initalize x, given a direction
    this.y =enemyInitialY(); //initialize y
    this.speed = randomSpeed()*this.direction; //initialize speed
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/Rock.png'; //image of an enemy.
    //console.log(this.direction); //used for debug
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x+this.speed*dt; 
    if((this.x>gameWidth+1 && this.direction == 1) || (this.x<-2 && this.direction == -1)){ //if an enemy is off the screen
    this.direction = randomDirection(); //reset direction
    this.x =enemyInitialX(this.direction); //reset x
    this.y =enemyInitialY(); //reset y
    this.speed = randomSpeed()*this.direction; //reset speed
    }
        

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x*101, this.y*83-27); //scaling the grid to the graphics
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var playerInitialX = 2; //initial x of the player
var playerInitialY = 5; //initial y of the player

var Player = function(){
    Enemy.call(this); //initialize using Enemy
    this.sprite = 'images/char-boy.png'; //image of the player
    this.x = playerInitialX;
    this.y = playerInitialY;
    //console.log("player created"); //used for debug
};
Player.prototype=Object.create(Enemy.prototype); //inherience
Player.prototype.constructor=Player; //inheritence
Player.prototype.handleInput = function (input){ //handles directions,as long as the player is on screen.
    if (input == "up" && this.y >0){
        this.y=this.y-1;
    }
    if (input == "left" && this.x >0){
        this.x=this.x-1;
    }
    if (input == "right" && this.x < gameWidth-1){
        this.x=this.x+1;
    }
    if (input == "down"&& this.y <gameHeight-1){
        this.y=this.y+1;
    }

};
//define messages. Naming canvas differently fron canvas used in game engine.
var canvasText = document.querySelector('canvas');
var ctxText = canvasText.getContext("2d");
ctxText.font = "30pt Impact";
ctxText.textAlign = "center";
ctxText.strokeStyle = "black";
ctxText.lineWidth = 3;
function winMessage(){
    ctxText.fillStyle = "blue";
    ctxText.fillText("you win!", canvasText.width/2,40);
    ctxText.strokeText("you win!", canvasText.width/2,40);
    setTimeout(function(){ctxText.clearRect(0,0,600,100);},1000); //wipe the letters after 1 second
}
function loseMessage(){
    ctxText.fillStyle = "red";
    ctxText.fillText("you got hit by a rock!", canvasText.width/2,40);
    ctxText.strokeText("you got hit by a rock!", canvasText.width/2,40);
    setTimeout(function(){ctxText.clearRect(0,0,600,100);},1000); //wipe the letters after 1 second
}



Player.prototype.update = function() {
    if (this.y===0){  //player lands on water
        winMessage();
        player = new Player(); //reset game
    }
    for (var enemy in allEnemies){
        if (Math.round(allEnemies[enemy].y)==this.y && Math.round(allEnemies[enemy].x)==this.x){ //collision detection
            loseMessage();
            player = new Player(); //reset game
            break;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies=[];
for (var i=0;i<Math.round(Math.random())*3+3;i++){ //generate between 3 to 6 enemies. 
    allEnemies.push(new Enemy());
}
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //console.log(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});