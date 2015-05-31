frontend-nanodegree-arcade-game
===============================

May 31, 2015 revision.
Based upon the last review, I have done a code 'refactoring'.
Hopefully this version follows the Javascrip OO paradigm more closely.
By moving the image manipulation parameters to a data structure,
there in just one 'render' function in the superclass.
Most of the code and functionality remain as before.

I am not understanding the issue related to these comments.

You should declare the player variable here!
Enemy.prototype.update = function(dt, player) {
Remember to add the player variable to the update method in your Engine.js file too.
Please do the same other variables such as ctx throughout your code.

Same here, you should declare player as a function parameter on line 98,
and then pass the actual player when the function is called.

===============================
===============================

Obtain the game folder.
Open the index.html file in the game folder to start the game.
Use keyboard arrow keys to move the player.
Cross to the water to score a crossing point.
Watch out for the bugs, if they run over you, you lose a life.
When the player moves, it 'jumps' into the next square.
Watch out for entering a bug square before there is clearence between the bug and player.
This is especially dangerous when moving left to right behind a bug.
Move into squares containing gems to score Gem points.
A new gem will appear randomly in a new square.
Time is limited, pay attention to the timer value.
The game ends when the timer hits zero or you lose all your lives.
Reload the page to start a new game.

Revision Notes:

'main()' returns if timerValue == 0 || player.lives == 0.
Created a game timer (click counting) in engine.js for about five minutes.
Game now uses Mozilla Axis-Aligned Bounding Box Collision Detection.
New gems appearing in player square went away after moving gem tests to update function.
Some of the gem update code was originally in the key-up handler.
Note the brief delay to draw player crossing into a water square after crossing the road.

References:

Attended a couple of Project 3 office hours.

Did a fair amount of iterative experimentation to make the images fit the grid.
I've never played with animation or games, just tried to apply the course material
and not look for existing solutions to game and animation issues.
I do remember playing Frogger many years ago.

Students should use this rubric:
https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797
for self-checking their submission.

