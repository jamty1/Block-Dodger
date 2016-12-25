var squares = [];
var interval = 2000;
var level = 1;
// square object
function square(x, y, width, height, velX, velY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velX = velX;
    this.velY = velY;
    this.friction = 0.98;
}

function getRandom(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

function newSquare() {
    var newObject = new square(getRandom(canvasWidth, 0), 0, 30, 30, 1, 3);
    squares.push(newObject);
}

function renderSquare(object) {
    mainContext.beginPath();
    mainContext.rect(object.x, object.y, object.width, object.height);
    mainContext.fillStyle = "blue";
    mainContext.fill();
}

function animateObject() {
    var i;
    for (i = 0; i < squares.length; i++) {
        // Objects will start moving down to rain over the player
        squares[i].y += squares[i].velY;
        if (squares[i].velY < 3) {
            squares[i].velY++;
        }
        squares[i].velY *= squares[i].friction;

        // Squares have more movement on levels multiple of 5
        if (level % 5 == 0) {
            squares[i].x += squares[i].velX;
            if (squares[i].velX < 2) {
                squares[i].velX += getRandom(3, -2);
            }
            squares[i].velX *= squares[i].friction;
        }

        checkObjectCanvasCollision(squares[i]);

        // Player collided to an object (Game Over)
        if (checkPlayerCollision(squares[i])) {
            document.getElementById("status").innerHTML = "Game Over";
            cancelAnimationFrame(animationId);
            window.clearInterval(timer);
            window.clearInterval(difficulty);
        }
        renderSquare(squares[i]);
    }
}

function checkObjectCanvasCollision(object) {
    if (object.y > canvasHeight - object.height || object.x < 0 
            || object.x > canvasWidth - object.width) {
        mainContext.clearRect(object.x, object.y, object.width, object.height);
        var index = squares.indexOf(object);
        squares.splice(index, 1)
    }
}

function checkPlayerCollision(object) {
    return !(player.x > object.x + object.width || player.x + player.width < object.x 
            || player.y > object.y + object.height || player.y + player.height < object.y);
}

// Create a new square every 4 seconds
// Initial square amount is 3
var squareAmount = 3;
window.setInterval(function() {
    for (var j = 0; j < squareAmount; j++) {
        newSquare();
    }
}, interval);

// Difficulty increases as time increases
var difficulty = window.setInterval(function() {
    level++;
    squareAmount++;
    // Every five levels, faster square spawning
    if (interval > 500 && level % 5 == 0) {
        interval -= 500;
    }
    document.getElementById("level").innerHTML = "Level: " + level;
}, 10000);

// Record the time that the player survives
var second = 0;
var minute = 0;
var timer = window.setInterval(function() {
    second++;
    if (second == 60) {
        second = 0;
        minute++;
    }
    document.getElementById("timer").innerHTML = ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2);
}, 1000);