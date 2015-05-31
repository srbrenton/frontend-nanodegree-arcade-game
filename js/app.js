
/********************************************************
 ******
 ******    Sprite Image Scaling Parameters
 ******
 *******************************************************/

var ImageParams = {
   'gem':    {'sx': 0, 'sy': 50, 'sWidth': 101, 'sHeight': 121, 'dx': 16,  'dy': 55,  'dWidth': 70, 'dHeight': 70},
   'player': {'sx': 0, 'sy': 50, 'sWidth': 101, 'sHeight': 106, 'dx': 6,   'dy': 45,  'dWidth': 90, 'dHeight': 90},
   'enemy':  {'sx': 0, 'sy': 63, 'sWidth': 100, 'sHeight': 90,  'dx': 0,   'dy': 70,  'dWidth': 70, 'dHeight': 70}
};

/********************************************************
 ******
 ******    Sprite Superclass
 ******
 *******************************************************/

var Sprite = function (imagePath, imageType) {

        this.imagePath = imagePath;
        this.imageType = imageType;

        this.row;
        this.col;

        this.x;
        this.y;

        this.sx = ImageParams[imageType].sx;
        this.sy = ImageParams[imageType].sy;
        this.sWidth = ImageParams[imageType].sWidth;
        this.sHeight = ImageParams[imageType].sHeight;
        this.dx = ImageParams[imageType].dx;
        this.dy = ImageParams[imageType].dy;
        this.dWidth = ImageParams[imageType].dWidth;
        this.dHeight = ImageParams[imageType].dHeight;
};

/********************************************************
 ******
 ******    Sprite.prototype.render
 ******
 *******************************************************/

Sprite.prototype.render = function (ctx) {

//        this.x = this.col * 101;
//        this.y = this.row * 83;

        ctx.drawImage(Resources.get(this.imagePath), this.sx, this.sy, this.sWidth, this.sHeight,
        	this.x + this.dx, this.y + this.dy, this.dWidth, this.dHeight);
};

/********************************************************
 ******
 ******    Player Subclass
 ******
 *******************************************************/

var Player = function(imagePath, imageType) {

        Sprite.call(this, imagePath, imageType);

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

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;

/********************************************************
 ******
 ******    Player.prototype.handleInput
 ******
 *******************************************************/

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
        this.x = this.col * 101;
        this.y = this.row * 83;

};

/********************************************************
 ******
 ******    Player.prototype.update
 ******
 *******************************************************/

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

var player = new Player('images/char-pink-girl.png', 'player');

/********************************************************
 ******
 ******    Gem Constructor
 ******
 *******************************************************/

var Gem = function(imagePath, imageType) {

        Sprite.call(this, imagePath, imageType);

        // toggle the Gem Color after capture
        this.spriteToggle = Boolean(false);

        // no gems visible until the first gem update
        this.gemVisible = Boolean(false);

        this.row = 0;
        this.col = 0;

//      console.log(this.imagePath);
};

Gem.prototype = Object.create(Sprite.prototype);
Gem.prototype.constructor = Gem;

/********************************************************
 ******
 ******    Gem.prototype.update
 ******
 *******************************************************/

Gem.prototype.update = function() {

        // if the gem and player are in the same square
        // capture by setting gemVisible to false

        if ( this.gemVisible && ( this.row == player.row) && ( player.col == this.col ) ) {
                this.gemVisible = Boolean(false);
                player.gems += 1;
        }

        // create a new gem when the player captures this gem

        if ( this.gemVisible === false ) {
                if ( this.spriteToggle ) {
                        this.imagePath = 'images/Gem Orange.png';
                        this.spriteToggle = Boolean(false);
                } else {
                        this.imagePath = 'images/Gem Blue.png';
                        this.spriteToggle = Boolean(true);
                }

                // pick a random square for the next gem

                this.row = this.getRandomInt(1,4);
                this.col = this.getRandomInt(0,5);
                this.gemVisible = Boolean(true);
                this.x = this.col * 101;
                this.y = this.row * 83;
        }


};

/********************************************************
 ******
 ******    Gem.prototype.getRandomInt
 ******
 *******************************************************/

Gem.prototype.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
};

/********************************************************
 ******
 ******    Gem.Instantiation
 ******
 *******************************************************/

var gem = new Gem('', 'gem');

/********************************************************
 ******
 ******    Enemy Constructor
 ******
 *******************************************************/

var Enemy = function(xpos, row, rate, imagePath, imageType) {

        Sprite.call(this, imagePath, imageType);

        // var enemy1 = new Enemy(-140,1,110);
        //
        // xpos - starting offscreen position for this sprite
        // row  - specify the row of bricks for this enemy on which this bug travels
        // rate  - specify the relative speed for this enemy

        // Variables applied to each of our instances go here, we've provided one for you to get started
        // The image/sprite for our enemies, this uses a helper we've provided to easily load images

//      this.sprite = 'images/enemy-bug.png';

        this.x = xpos;
        this.row = row;
//      this.col = 0;
        this.y = this.row * 83 - 20;  // raise the enemy sprite by 20 pixels
        this.rate= rate;

        // variables for collision calculations
        this.x1 = this.y1 = 0;
        this.w1;
        this.h1;
        this.x2;
        this.y2;
        this.w2;
        this.h2;

};

Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/********************************************************
 ******
 ******    Enemy.prototype.update
 ******
 *******************************************************/

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
        //              collision detected!
        //   }

        // Frogger implementation of Bounding Box Collision Detection
        // x1 enemy
        // x2 player

        // Turn on bounding box displays by setting defDebug to true in engin.js

        this.x1 = this.x + 0;
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


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//var enemy1 = new Enemy(-140, 1, 110, 'images/enemy-bug.png', 'enemy');
//var enemy2 = new Enemy(-180, 2, 150, 'images/enemy-bug.png', 'enemy');
//var enemy3 = new Enemy(-120, 3, 190, 'images/enemy-bug.png', 'enemy');

// use these instances for a slower bug movement
var enemy1 = new Enemy(-140, 1, 60, 'images/enemy-bug.png', 'enemy');
var enemy2 = new Enemy(-180, 2, 100, 'images/enemy-bug.png', 'enemy');
var enemy3 = new Enemy(-120, 3, 140, 'images/enemy-bug.png', 'enemy');

var allEnemies = [ enemy1, enemy2, enemy3 ];

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
