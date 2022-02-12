

$('#bt_start').click(function() {
    $(this).hide();
    $('#game_board').show();
    init();    
});
$('#bt_up').mousedown(function() {
    moveEvent(1);
});
$('#bt_down').mousedown(function() {
    moveEvent(3);
});
$('#bt_left').mousedown(function() {
    moveEvent(0);
});
$('#bt_right').mousedown(function() {
    moveEvent(2);
});

var ctx;
var turn  = [];

var c_width = 30;
var c_height = 30;

var xV = [-1, 0, 1, 0];
var yV = [0, -1, 0, 1];
var queue = [];

var elements = 2;
var map = [];

var X = 5 + (Math.random() * (c_width - 10))|0;
var Y = 5 + (Math.random() * (c_height - 10))|0;

var direction = Math.random() * 3 | 0;

var interval = 0;

var score = 0;
var inc_score = 1;
var clock_sec = 0;

var sum = 0, easy = 0, speed = 160;

var i, dir;

var canvas = document.createElement('canvas');

function init() {
    for (i = 0; i < c_width; i++) {
        map[i] = [];
    }
    canvas.setAttribute('width', c_width * 10);
    canvas.setAttribute('height', c_height * 10);
    ctx = canvas.getContext('2d');
    document.getElementById('game_play').appendChild(canvas);
    var gradient = ctx.createLinearGradient(0,0,c_width * 10,c_height * 10);
    gradient.addColorStop(0,'red');
    gradient.addColorStop(1,'blue');    
    ctx.fillStyle = gradient;  
    ctx.strokeStyle = 'black';  

    placeFood();

    interval = window.setInterval(clock, speed);
}


function placeFood() {
    var x, y;
    do {
        x = Math.random() * c_width|0;
        y = Math.random() * c_height|0;
    } while (map[x][y]);

    map[x][y] = 1;

    ctx.strokeRect(x * 10 + 1, y * 10 + 1, 10 - 2, 10 - 2);
}



function clock() {
    if (easy) {
        X = (X+c_width)%c_width;
        Y = (Y+c_height)%c_height;
    }

    if (turn.length) {
        dir = turn.pop();
        if ((dir % 2) !== (direction % 2)) {
            direction = dir;
        }
    }

    if ((easy || (0 <= X && 0 <= Y && X < c_width && Y < c_height)) && 2 !== map[X][Y]) {

        if (1 === map[X][Y]) {
            eatTrigger();
            score+= inc_score;            
            placeFood();
            elements++;
        }

        ctx.fillRect(X * 10, Y * 10, 10 - 1, 10 - 1);
        map[X][Y] = 2;
        queue.unshift([X, Y]);

        X+= xV[direction];
        Y+= yV[direction];

        if (elements < queue.length) {
            dir = queue.pop()

            map[dir[0]][dir[1]] = 0;
            ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
        }

    } else if (!turn.length) {

        if (confirm("Game Over! Do you want to play again? Your Score is " + score)) {
            window.clearInterval(interval);
            location.reload();
            
        } else {
            window.clearInterval(interval);                       
            window.location = "intro.html";
        }
    }
    clock_sec = new Date().getTime();
    $('#score_board').html(score);

}

function eatTrigger(){
    console.log("eat! " + score + " " + (new Date().getTime() - clock_sec) );
}

document.onkeydown = function(e) {

    var code = e.keyCode - 37;
    moveEvent(code);
    
}


function moveEvent(code){
    /*
                * 0: left
                * 1: up
                * 2: right
                * 3: down
                **/
    if (0 <= code && code < 4 && code !== turn[0]) {
        turn.unshift(code);
    } else if (-5 == code) {

        if (interval) {
            window.clearInterval(interval);
            interval = null;
        } else {
            interval = window.setInterval(clock, 60);
        }

    } else { // O.o
        dir = sum + code;
        if (dir == 44||dir==94||dir==126||dir==171) {
            sum+= code
        } else if (dir === 218) easy = 1;
    }        
}