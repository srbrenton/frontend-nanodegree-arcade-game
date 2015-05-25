
var Gem = function() {

	// certainly we could create multiple gems, but we don't

	this.sprite = 'images/Gem Blue.png';

	// toggle the Gem Color after capture

	this.spriteToggle = Boolean(false);

	// no gems visible until the first gem update

	this.gemVisible = Boolean(false);

	this.row = 0;
	this.col = 0;
};

Gem.prototype.update = function() {

	// if the gem and player are in the same square
	// capture by setting gemVisible to false

	if ( gem.gemVisible && ( gem.row == player.row) && ( player.col == gem.col ) ) {
		gem.gemVisible = Boolean(false);
		player.gems += 1;
	}

	// create a new gem when the player captures this gem

	if ( this.gemVisible === false ) {
		if ( this.spriteToggle ) {
			this.sprite = 'images/Gem Orange.png';
			this.spriteToggle = Boolean(false);
		} else {
			this.sprite = 'images/Gem Blue.png';
			this.spriteToggle = Boolean(true);
		}

		// pick a random square for the next gem

		this.row = getRandomInt(1,4);
		this.col = getRandomInt(0,5);
		this.gemVisible = Boolean(true);
	}
};

Gem.prototype.render = function() {

	// the offsets to the gem x and y coordinates position the scaled gem within a game square
	ctx.drawImage(Resources.get(this.sprite), this.col * 101 + 5, this.row * 83 + 35, 90, 90);

};

// Borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random number between min (inclusive) and max (exclusive)

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Enemies our player must avoid

var Enemy = function(xpos, row, rate) {

	// var enemy1 = new Enemy(-140,1,110);
	//
	// xpos - starting offscreen position for this sprite
	// row  - specify the row of bricks for this enemy on which this bug travels
	// rate  - specify the relative speed for this enemy

	// Variables applied to each of our instances go here, we've provided one for you to get started
	// The image/sprite for our enemies, this uses a helper we've provided to easily load images

	this.sprite = 'images/enemy-bug.png';

	this.x = xpos;
	this.row = row;
	this.y = this.row * 83 - 20;  // raise the enemy sprite by 20 pixels
	this.rate= rate;

	// variables for collision calculations
	this.x1;
	this.y1;
	this.w1;
	this.h1;
	this.x2;
	this.y2;
	this.w2;
	this.h2;

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {

	// if the enemy has moved off the right of the grid
	// move him off the grid to the left
	// my brain has been wired since the early 1980's to use the ternary operation for LH assingment
	// this.x -= (this.x > 610)? 700: 0;

	this.x > 610 ? this.x -= 700 : this.x -= 0;

	// You should multiply any movement by the dt parameter which will ensure the game runs
	// at the same speed for all computers.

	this.x += dt * this.rate;

	// turn this on to try and remember how the x value varies
	// as you got the bugs moving at different speeds
	// if ( this.row == 3) {
	//    console.log(this.x);
	// }

	// Axis-Aligned Bounding Box Collision Detection
	// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	//
	//   if (rect1.x < rect2.x + rect2.width  && rect1.x + rect1.width > rect2.x &&
	//       rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
	// 		collision detected!
	//   }

	// Frogger implementation of Bounding Box Collision Detection
	// x1 enemy
	// x2 player

	// Turn on bounding box displays by uncommenting fillRect statements
	// in the player and enemy render functions
	// set the x, y, height and width for this enemy and player images

	this.x1 = this.x + 5;
	this.y1 = this.y + 80;
	this.w1 = 70;
	this.h1 = 60;
	this.x2 = player.col * 101 + 15;
	this.y2 = player.row * 83 + 50 + 15;
	this.w2 = 71;
	this.h2 = 53;

	if ( this.x1 < this.x2 + this.w2 && this.x1 + this.w1 > this.x2 &&
	     this.y1 < this.y2 + this.h2 && this.h1 + this.y1 > this.y2 ) {

		player.row = 5;
		player.col = 2;
		player.lives -= 1;
	}
};

// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {

	// enemy was raised 20 pixels in the object definition
	// draw the enemy rectangle for debuging
//	ctx.fillRect(this.x + 5, this.y + 80, 70, 60);

	ctx.drawImage(Resources.get(this.sprite), 0, 63, 100, 83, this.x, this.y + 63, 80, 80);
};

var Player = function() {

	// lets make the player a girl
	this.sprite = 'images/char-pink-girl.png';

	// player starting position on grid
	this.row = 4;
	this.col = 2;

	// we'll be using x and y for collision detection
	this.x = 0;
	this.y = 0;

	// lives and a gem count give this game a purpose
	this.lives = 15;
	this.gems = 0;
	this.splash = 0;

	this.tickCount = 0;
	this.now;
	this.lastTime = 0;

};

Player.prototype.update = function() {

	var dt;
        this.now = Date.now();
        dt = (this.now - this.lastTime) / 10;

	// delay a few ticks when reaching the water
	// so that the player image is seen moving into the water
	// increment the crossings count (splash)
	// put the player back on the grass

	if ( this.row === 0 && dt > 3 ) {
		this.splash += 1;
		this.row = 4;
		this.col = 2;
	}

	this.x = this.col * 101;
	this.y = this.row * 83;

};

Player.prototype.render = function() {

	// draw the player rectangle for debuging
//	ctx.fillRect(this.x + 15, this.y + 65, 71, 53);

	// raise the player image by 10 pixels
	ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83 - 10);

};

// Move the player around with the keyboard arrow keys

Player.prototype.handleInput = function(keyCode) {

	// Only arrow keyCodes are delivered by the document 'keyup' EventListener
	// Range check movement to our playing grid
	// Keep the player confined to a 6 by 5 grid

	switch(keyCode) {
		case 'up':
			this.row -= ( this.row > 0 )? 1: 0;
			break;
		case 'down':
			this.row += ( this.row < 5 )? 1: 0;
			break;
		case 'left':
			this.col -= ( this.col > 0 )? 1: 0;
			break;
		case 'right':
			this.col += ( this.col < 4 )? 1: 0;
			break;
		default:
			break;
	}

	// setup for an player.update()  delay when the player reaches the water
	if ( this.row === 0 ) {
		this.lastTime = Date.now();
	}

	// generate an x and y coordinate for the player for enemy collision detection
	player.x = this.col * 101;
	player.y = this.row * 83;

};

// Now instantiate your objects.

//var enemy1 = new Enemy(-140,1,110);
//var enemy2 = new Enemy(-180,2,150);
//var enemy3 = new Enemy(-120,3,190);

// use these instances for a slower bug movement
var enemy1 = new Enemy(-140,1,60);
var enemy2 = new Enemy(-180,2,100);
var enemy3 = new Enemy(-120,3,140);

var allEnemies = [ enemy1, enemy2, enemy3 ];
var gem = new Gem();
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

    player.handleInput(allowedKeys[e.keyCode]);
});

