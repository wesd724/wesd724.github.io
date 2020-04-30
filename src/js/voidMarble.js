let canvas = document.getElementById("mainCanvas");
let ctx = canvas.getContext("2d");
const marbleNumber = 50;
let dropMarble = [];
let setMarble = { positionY: 0, radius: 5 };
let game = { status: true };

function marble(y,r) {
    this.y = y;
    this.r = r;
}

marble.prototype = {
    setRandomPositionX: function() {
        this.x = Math.floor(Math.random() * 600);
        return this;
    },
    setRandomVelocity: function() {
        this.dy = (Math.random() * 10) + 5;
        return this;	
    },
    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, true);
        ctx.fill();
        ctx.closePath();
        if(game.status == false) {
            ctx.clearRect(0,0,canvas.width,canvas.height);
        } // this 'if' clear "maincanvas"
        return this;
    },
    drop: function() {
        this.y += this.dy;
        return this;
    },
    keepFall: function() {
        if(this.y + setMarble.radius > canvas.height) {
            this.r = (Math.random() * 5) + 5; // NEW radius
            this.y = setMarble.positionY; // RESET positionY
            this.x = Math.floor(Math.random() * 600); // NEW setRandomPositionX
            this.dy = (Math.random() * 15) + 5; // NEW setRandomVelocity
        }
        return this;
    },
    collisionToPeople: function() {
        if(this.x + this.r >= setPeople.x &&
            this.x - this.r <= setPeople.x + setPeople.width &&
            this.y >= canvas.height - setPeople.height) {
            gameOver();
        }
        return this;		
    },
};
/****************************Marble************************************/
for(let i = 0; i < marbleNumber; i++) {
    dropMarble[i] = new marble(setMarble.positionY, setMarble.radius);
    dropMarble[i].setRandomPositionX().setRandomVelocity();
} // Initial setting(first Marble drop setting)


function drawMarble() {
    if(game.status == true) {
        for(let i = 0; i < dropMarble.length; i++) {
            dropMarble[i].drop().collisionToPeople().keepFall().draw();
        }
    }
}
/****************************Timer************************************/
let screen = document.getElementById("timerScreen");

function timerStart() {
    let startTime = Date.now();
    g_timer = setInterval(() => {
        now = Date.now();
        screen.innerHTML = ((now - startTime)/1000).toFixed(2);
    }, 10);
}
/****************************People************************************/	
let setPeople = { width: 10, height: 50, x: canvas.width / 2 };

function drawPeople() {
    if(game.status == true) {
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.rect(setPeople.x, canvas.height - setPeople.height, setPeople.width, setPeople.height);
        ctx.fill();
        ctx.closePath();
    }
}

/************************ Start screen****************************************/
function startScreen() {
    let s_go = document.getElementById("s_go");
    let s_exit = document.getElementById("s_exit");
    s_go.addEventListener('click', function () {
        startgame();
    });
    s_go.addEventListener('click', function () {
        s_go.innerHTML = "";
        s_exit.innerHTML = "";
    });
    s_go.addEventListener('mouseover', function () {
        s_go.style = "font-size: 60px";
    });
    s_go.addEventListener('mouseout', function () {
        s_go.style = "font-size: 50px";
    });

    canvas.style = "background-color:#B6DEBF"
    ctx.font = "bold 50px Arial";
    ctx.fillText("Start game?", canvas.width - 450, canvas.height - 350);
}

startScreen();
/************************ Game over screen****************************************/	
function gameOver() {
    game.status = false;
    canvas.style = null;
    clearAllInterval();
    
    for(let i = 0; i < marbleNumber; i++) {
        dropMarble[i] = new marble(setMarble.positionY, setMarble.radius);
        dropMarble[i].setRandomPositionX().setRandomVelocity();
    } // Initial setting(first Marble drop setting)

    gameOverScreen();
}

function gameOverScreen() {
    let out = document.getElementById("outCanvas")
    let outctx = out.getContext("2d");
    let o_go = document.getElementById("o_go");
    let o_exit = document.getElementById("o_exit");

    outctx.font = "bold 50px Arial";
    outctx.fillStyle = "yellow";
    outctx.fillText("Restart game?", canvas.width - 470, canvas.height - 350);

    outctx.font = "bold 30px Arial";
    outctx.fillStyle = "#fff";
    outctx.fillText(`Previous Time: ${screen.innerHTML}`, canvas.width - 440, canvas.height - 50);

    o_go.innerHTML = "RESTART!";
    o_exit.innerHTML = "NO";
    o_go.addEventListener('click', function () {
        game.status = true;
        outctx.clearRect(0, 0, canvas.width, canvas.height);
        clearAllInterval();
        startgame();
    });
    o_go.addEventListener('click', function () {
        o_go.innerHTML = "";
        o_exit.innerHTML = "";
    });
    o_go.addEventListener('mouseover', function () {
        o_go.style = "font-size: 60px";
    });
    o_go.addEventListener('mouseout', function () {
        o_go.style = "font-size: 50px";
    });
}

/****************************setting****************************/
let leftKey = false, rightKey = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 37) {
        leftKey = true;
    } else if (e.keyCode == 39) {
        rightKey = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 37) {
        leftKey = false;
    } else if (e.keyCode == 39) {
        rightKey = false;
    }
}	
function drawIntergration() {
    canvas.style.backgroundColor = " #FFFCC2";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMarble();
    drawPeople();
    if(leftKey && setPeople.x > 0) {
        setPeople.x -= 7;
    } else if (rightKey && setPeople.x < canvas.width - setPeople.width) {
        setPeople.x += 7;
    }
}

/************************ draw canvas like animation************************/	
function startgame() {
    g_interval = setInterval(drawIntergration, 33);
    timerStart();
}

function clearAllInterval() {
    clearInterval(g_interval);
    clearInterval(g_timer);
}
// 구슬이 떨어질 때 바닥이 닿기 전에도 새로운 구슬이 떨어지도록 만들기.