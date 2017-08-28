let winArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
let mapNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
const clickCellprop = {
    "isMove": false,
    "indexClicked": "",
    "indexEmpty": "",
    "cssObjOfMove": {}
};
let startStopWatch;

function renderGame(arr) {
    arr.forEach(el => {
        if (el === 0) {
            $("#container").append($("<div>").addClass("empty"));
        } else {
            $("#container").append($("<div>").html(el));
        }
    });
}

renderGame(winArray);

function shuffle(arr) {
    for (let i = arr.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
    return arr;
}


function swap(a, b, arr) {
    let saveValue = arr[a];
    arr[a] = arr[b];
    arr[b] = saveValue;
}


function checkIsEmptyNear(n) {
    let width = $("#container div").outerWidth() + "px";
    let heigth = $("#container div").outerHeight() + "px";
    clickCellprop.isMove = false;
    if (n === "") {
        clickCellprop.isMove = false;
        return;
    }
    clickCellprop.indexClicked = mapNumbers.findIndex(el => el === n);
    clickCellprop.indexEmpty = mapNumbers.findIndex(el => el === 0);

    if (mapNumbers[clickCellprop.indexClicked - 1] === 0 && clickCellprop.indexClicked % 4 !== 0) {
        clickCellprop.isMove = true;
        clickCellprop.cssObjOfMove = {
            "left": "-=" + width
        };
    } else if (mapNumbers[clickCellprop.indexClicked + 1] === 0 && (clickCellprop.indexClicked + 1) % 4 !== 0) {
        clickCellprop.isMove = true;
        clickCellprop.cssObjOfMove = {
            "left": "+=" + width
        };
    } else if (mapNumbers[clickCellprop.indexClicked - 4] === 0) {
        clickCellprop.isMove = true;
        clickCellprop.cssObjOfMove = {
            "top": "-=" + heigth
        };
    } else if (mapNumbers[clickCellprop.indexClicked + 4] === 0) {
        clickCellprop.isMove = true;
        clickCellprop.cssObjOfMove = {
            "top": "+=" + heigth
        };
    } else {
        clickCellprop.isMove = false;
    }
}

function isWin() {
    result = false;
    if (mapNumbers.join() === winArray.join()) {
        result = true;
    }
    return result;
}

function stopWatchCallback() {
    let sec = 0;
    let min = "00";
    return function() {
        if (sec < 59) {
            sec++;
        } else {
            sec = 0;
            min++;
            if (min < 10) {
                min = "0" + min;
            }
        }
        if (sec < 10) {
            sec = "0" + sec;
        }
        $(".watch span").html(min + ":" + sec);
    };
}

function stopStopWatch() {
    clearInterval(startStopWatch);
}

function clearStopWatch() {
    $(".watch span").html("00:00");
}

function animate(event) {
    let value = $(this).html();
    if (value === "") {
        value = value;
    } else {
        value = parseInt(value);
    }
    checkIsEmptyNear(value);
    if (clickCellprop.isMove) {
        swap(clickCellprop.indexClicked, clickCellprop.indexEmpty, mapNumbers);
        $(this).animate(clickCellprop.cssObjOfMove, 425).promise()
            .done(function() {
                $("#container").html("");
                renderGame(mapNumbers);
            });
        let step = parseInt($(".steps span").html()) + 1;
        $(".steps span").html(step);
        if (isWin()) {
            stopStopWatch();
            alert(`Gratz! You won whith ${$(".steps span").html()} steps, you time is ${$(".watch span").html()}. Try more to do your best :)`);
            $("#container").off("click", "div", animate);
            $("#container").on("click", "div", shakeStart);
        }
    }
}



$("button[name = 'Start']").click(function(event) {
    event.stopPropagation();
    stopStopWatch();
    clearStopWatch();
    $("#container").off("click", "div", shakeStart);
    $("#container").off("click", "div", animate);
    $("#container").on("click", "div", animate);
    $("#container").html("");
    renderGame(shuffle(mapNumbers));
    $(".steps span").html(0);
    clearStopWatch();
    startStopWatch = setInterval(stopWatchCallback(), 1000);
});

$("button[name = 'Win']").click(function(event) {
    event.stopPropagation();
    $("#container").html("");
    renderGame(winArray);
    $(".steps span").html(0);
    $("#container").off("click", "div", animate);
    $("#container").on("click", "div", shakeStart);
    stopStopWatch();
    clearStopWatch();
    alert("You won, but whith cheat, try to solve it by yourself :)");
});


$("#container").on("click", "div", shakeStart);

function shakeStart() {
    $("button[name = 'Start']").shake(4, 2, 700);
}

// i don't want download a one more libraly, so i stole a pollyfil
jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
    intShakes = intShakes || 10;
    intDistance = intDistance || 2;
    intDuration = intDuration || 1000;

    this.each(function() {
        $(this).css("position", "relative");
        for (var x = 1; x <= intShakes; x++) {
            $(this).animate({
                    left: (intDistance * -1)
                }, (((intDuration / intShakes) / 4)))
                .animate({
                    left: intDistance
                }, ((intDuration / intShakes) / 2))
                .animate({
                    left: 0
                }, (((intDuration / intShakes) / 4)));
        }
    });
    return this;
};
