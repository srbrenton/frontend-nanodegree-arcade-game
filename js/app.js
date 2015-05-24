
var Gem = function() {

	// certainly we could create multiple gems, but we don't

	this.sprite = 'images/Gem Blue.png';

	// toggle the Gem Color after capture
	this.spriteToggle = false;

	// no gems visible until the first gem update
	this.gemVisible = false;
	
	this.row = -1;
	this.col = -1;
}

Gem.prototype.update = function() {

	// create a new gem when the player captures this gem

	if ( ! this.gemVisible ) {
		if ( this.spriteToggle ) {
			this.sprite = 'images/Gem Orange.png';
			this.spriteToggle = false;
		}
		else {
			this.sprite = 'images/Gem Blue.png';
			this.spriteToggle = true;
		}

		// pick a random square for the next gem
		// the gem can randomly end up in the same square again
		// but that's a problem for another day.

		this.row = getRandomInt(1,4);
		this.col = getRandomInt(0,5);
		this.gemVisible = true;
	}
}

Gem.prototype.render = function() {

	// the offsets to the gem x and y coordinates position the scaled gem within a game square
	ctx.drawImage(Resources.get(this.sprite), this.col * 101 + 5, this.row * 83 + 35, 90, 90);
}

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
    this.maxIterations = 5000;

}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {

	if ( this.maxIterations > 0 ) {
	
		// if the enemy has moved off the right of the grid
		// move him off the grid to the left

		this.x -= (this.x > 610)? 700: 0;
	
		// You should multiply any movement by the dt parameter which will ensure the game runs
		// at the same speed for all computers.

		this.x += dt * this.rate;

		// turn this on to try and remember how the x value varies
		// as you got the bugs moving at different speeds
		// if ( this.row == 3) {
		//    console.log(this.x);
		// }
		
		this.maxIterations -= 1;
	
		// Use the distance formula do approximate the distance between the centers of the sprites
	
		with (Math) {
	
			var distance = sqrt(pow(this.x - player.x + 50, 2) + pow(this.y - player.y + 41 , 2));
	
		}
	
		// If the player and enemy are arbitrarily close enough (collision), reset the player
	
		if ( distance < 25 ) {
			// console.log(distance);
			// console.log('collision');
			player.row = 4;
			player.col = 2;
			player.lives -= 1;
			
		}
	}
}


// Draw the enemy on the screen, required method for game

Enemy.prototype.render = function() {

	// enemy was raised 20 pixels in the object definition
	ctx.drawImage(Resources.get(this.sprite), 0, 63, 100, 83, this.x, this.y + 63, 80, 80);

}

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
	this.lives = 20;
	this.gems = 0;
}

Player.prototype.update = function() {

	this.x = this.col * 101;
	this.y = this.row * 83;

}

Player.prototype.render = function() {

	// raise the player image by 10 pixels
	ctx.drawImage(Resources.get(this.sprite), this.col * 101, this.row * 83 - 10);
}

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

	// generate an x and y coordinate for the player for enemy collision detection
	player.x = this.col * 101;
	player.y = this.row * 83;

	// check to see if our new square contains a gem
	// capture by setting gemVisible to false
	if ( gem.gemVisible && ( gem.row == this.row) && ( this.col == gem.col ) ) {
		gem.gemVisible = false;
		gem.row = -1;
		gem.col = -1;
		player.gems += 1;
	}
	
}

// Now instantiate your objects.

var enemy1 = new Enemy(-140,1,110);
var enemy2 = new Enemy(-180,2,150);
var enemy3 = new Enemy(-120,3,190);

var allEnemies = [ enemy1, enemy2, enemy3 ];
var gem = new Gem;
var player = new Player;

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

