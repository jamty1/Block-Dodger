var player = {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    maxspeed: 2,
    friction: 0.90,
    velX: 0,
    velY: 0,
    money: 0
}
var keys = [];
var mainCanvas;
var mainContext;
var canvasWidth;
var canvasHeight;
var animationId;

function init() {
    mainCanvas = document.getElementById("container");
    mainContext = mainCanvas.getContext("2d");
    canvasWidth = mainCanvas.width;
    canvasHeight = mainCanvas.height;
    player.y = canvasHeight - player.height;
    player.x = canvasWidth / 2;
    mainCanvas.focus();
    initUpgrades();
    drawSpawnPoint();
    animateObject();
    playerAnimate();
}

// Spawn point of objects coming down
function drawSpawnPoint() {
    mainContext.rect(0, 0, canvasWidth, 100);
    mainContext.fillStyle = "grey";
    mainContext.fill();
}

function playerAnimate() {
    animationId = requestAnimationFrame(playerAnimate);
    // Display player coordinates
    document.getElementById("coordinates").innerHTML = "x: " + player.x + " y: " + player.y;
    mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
    drawSpawnPoint();

    // Handle key events
    // Up
    if (keys[38] || keys[87]) {
        if (player.velY > -player.maxspeed) {
            player.velY--;
        }
    }
    // Down
    if (keys[40] || keys[83]) {
        if (player.velY < player.maxspeed) {
            player.velY++;
        }
    }
    // Right
    if (keys[39] || keys[68]) {
        if (player.velX < player.maxspeed) {
            player.velX++;
        }
    }
    // Left
    if (keys[37] || keys[65]) {
        if (player.velX > -player.maxspeed) {
            player.velX--;
        }
    }
    // Check if player has hit cavas boundary
    checkPlayerCanvasCollision();

    player.x += player.velX;
    player.y += player.velY;

    // Friction for smooth movement
    player.velX *= player.friction;
    player.velY *= player.friction;

    player.x = Math.round(player.x);
    player.y = Math.round(player.y);

    // Redraw the player position
    mainContext.beginPath();
    mainContext.rect(player.x, player.y, player.width, player.height);
    mainContext.fillStyle = "red";
    mainContext.fill();
    animateObject();
}

function checkPlayerCanvasCollision() {
    if (player.y < 100) {
        player.velY = 0;
        player.y = 100;
    }
    if (player.y > canvasHeight - player.height) {
        player.velY = 0;
        player.y = canvasHeight - player.height;
    }
    if (player.x < 0) {
        player.velX = 0;
        player.x = 0;
    }
    if (player.x > canvasWidth - player.width) {
        player.velX = 0;
        player.x = canvasWidth - player.width;
    }
}

document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
    e.preventDefault();
});
document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
    e.preventDefault();
});


// Upgrades available for the player to use
function initUpgrades() {
    document.getElementById("money").innerHTML = "Money: " + player.money;
    document.getElementById("speedcost").innerHTML = "Cost: " + speedcost;
    document.getElementById("sizecost").innerHTML = "Cost: " + sizecost;
}
var speedcost = 5;
function speedUpgrade() {
    if (player.money >= speedcost) {
        player.money -= speedcost;
        player.maxspeed += 0.50;
        speedcost++;
        document.getElementById("speedcost").innerHTML = "Cost: " + speedcost;
    }
}

var sizecost = 5;
var sizemax = false;
function decreaseSize() {
    if (player.money >= sizecost && !sizemax) {
        player.money -= sizecost;
        player.height--;
        player.width--;
        sizecost++;
        document.getElementById("sizecost").innerHTML = "Cost: " + sizecost;
    }
    if (player.width == 10) {
        sizemax = true;
        document.getElementById("sizecost").innerHTML = "max";
    }
}