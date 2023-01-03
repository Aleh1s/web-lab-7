const workElement = document.getElementById("work");
const playButton = document.getElementById("playButton");
const closeButton = document.getElementById("closeButton");
const controlMessage = document.getElementById("controlMessage");
const variableButton = document.getElementById("variableButton");
let variableButtonValue = "start";

playButton.onclick = openWork;
closeButton.onclick = closeWork;
variableButton.onclick = startAnimation;

function openWork(e) {
    workElement.classList.add("active");
    renderStartButton()
    init();
}

function closeWork(e) {
    end = true;
    workElement.classList.remove("active");
}

let area = document.getElementById("area");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

const borderSize = 10;

let window_width;
let window_height;
let circle1;
let circle2;
let end;

function init() {
    window_height = Math.floor(area.offsetHeight - borderSize);
    window_width = Math.floor(area.offsetWidth - borderSize);

    canvas.height = window_height;
    canvas.width = window_width;

    canvas.style.background = "rgba(0, 0, 0, 0)";

    const radius = 10;
    const speed = 10;

    circle1 = new Circle(random(radius, window_width - radius), radius, radius, "blue", speed, "Blue circle");
    circle2 = new Circle(random(radius, window_width - radius), window_height - radius, radius, "orange", speed, "Orange circle");

    circle1.draw(context);
    circle2.draw(context);
}

function startAnimation() {
    if (variableButtonValue === "start") {
        controlMessage.innerText = "Start button is activated"
        variableButton.disabled = true
        end = false;
        updateCircles();
    } else if (variableButtonValue === "reload") {
        controlMessage.innerText = "Reload button is activated"
        init()
        renderStartButton()
    }
}

class Circle {
    constructor(xPos, yPos, radius, color, speed, name) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.name = name;

        this.xAngle = random(0.2, 0.8);
        this.yAngle = random(0.2, 0.8);
    }

    draw(context) {
        context.beginPath();
        context.arc(this.xPos, this.yPos, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update(context) {
        if ((this.xPos + this.radius) > window_width) {
            controlMessage.innerText = `${this.name} touches right wall`
            this.changeXDirection();
        }

        if ((this.xPos - this.radius) < 0) {
            controlMessage.innerText = `${this.name} touches left wall`
            this.changeXDirection();
        }

        if ((this.yPos + this.radius) > window_height) {
            controlMessage.innerText = `${this.name} touches downer wall`
            this.changeYDirection();
        }

        if ((this.yPos - this.radius) < 0) {
            controlMessage.innerText = `${this.name} touches upper wall`
            this.changeYDirection();
        }

        this.xPos += this.speed * this.xAngle;
        this.yPos += this.speed * this.yAngle;

        this.draw(context);
    }

    changeXDirection() {
        this.xAngle = -this.xAngle;
    }

    changeYDirection() {
        this.yAngle = -this.yAngle;
    }
}

function updateCircles() {
    console.log("update circles")
    if (!end) {
        requestAnimationFrame(updateCircles);
        console.log("if scope")
        context.clearRect(0, 0, window_width, window_height);
        circle1.update(context);
        circle2.update(context);
        if (checkForCollision()) {
            controlMessage.innerText = "Circles touch each other"

            circle1.changeXDirection()
            circle2.changeXDirection()

            circle1.changeYDirection()
            circle2.changeYDirection();
        }

        if (checkForEndGame()) {
            controlMessage.innerText = "Both are on the same part"
            endGame();
        }
    }
}

function endGame() {
    end = true;
    renderReloadButton()
}

function checkForCollision() {
    return Math.sqrt(Math.pow(circle1.xPos - circle2.xPos, 2) + Math.pow(circle1.yPos - circle2.yPos, 2)) < (circle1.radius + circle2.radius)
}

function checkForEndGame() {
    return (onUpperPart(circle1) && onUpperPart(circle2)) || (onDownerPart(circle1) && onDownerPart(circle2));
}

function onUpperPart(circle) {
    return 0 < circle.yPos && circle.yPos + circle.radius <= (window_height / 2);
}

function onDownerPart(circle) {
    return (window_height / 2) <= (circle.yPos - circle.radius) && (circle.yPos + circle.radius) <= window_height;
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function renderReloadButton() {
    variableButtonValue = "reload"
    variableButton.disabled = false
    variableButton.innerText = "Reload"
}

function renderStartButton() {
    variableButtonValue = "start"
    variableButton.disabled = false
    variableButton.innerText = "Start"
}