const intro = document.getElementById("missionIntro");
const skip = document.getElementById("skipIntro");

if (skip && intro) {
  skip.addEventListener("click", () => {
    intro.style.display = "none";
  });
}

window.addEventListener("load", () => {
  setTimeout(() => {
    if (intro) intro.style.display = "none";
  }, 5600);
});

/* Booking message generator */
const bookingForm = document.getElementById("bookingForm");
const output = document.getElementById("bookingOutput");

if (bookingForm && output) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const vehicle = document.getElementById("vehicle").value || "Not provided";
    const service = document.getElementById("service").value;
    const message = document.getElementById("message").value || "No special request";

    const bookingText =
`BOOKING REQUEST GENERATED

Name: ${name}
Phone: ${phone}
Vehicle: ${vehicle}
Service: ${service}
Request: ${message}

Next step:
Copy this message and send it to info@mtllavage.com .`;

    output.textContent = bookingText;
    output.style.display = "block";
  });
}

/* MTLLavage pothole jump mini-game */
const gameArea = document.getElementById("gameArea");
const gameCar = document.getElementById("gameCar");
const hurdle = document.getElementById("hurdle");
const scoreBox = document.getElementById("score");

let score = 0;
let lastHurdleX = null;
let gameOverCooldown = false;

function jumpCar() {
  if (!gameCar || gameCar.classList.contains("jump")) return;
  gameCar.classList.add("jump");
  setTimeout(() => gameCar.classList.remove("jump"), 620);
}

function resetScore() {
  score = 0;
  if (scoreBox) scoreBox.textContent = `Score: ${score}`;
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    jumpCar();
  }
});

if (gameArea) {
  gameArea.addEventListener("click", jumpCar);
  gameArea.addEventListener("touchstart", (e) => {
    e.preventDefault();
    jumpCar();
  }, { passive: false });
}


function showOuch() {
  if (!gameArea) return;
  const old = gameArea.querySelector(".ouch-text");
  if (old) old.remove();

  const ouch = document.createElement("div");
  ouch.className = "ouch-text";
  ouch.textContent = "OUCH!";
  gameArea.appendChild(ouch);

  setTimeout(() => ouch.remove(), 800);
}

function gameLoop() {
  if (!gameCar || !hurdle || !scoreBox) return;

  const carRect = gameCar.getBoundingClientRect();
  const hurdleRect = hurdle.getBoundingClientRect();

  const overlap =
    carRect.left < hurdleRect.right &&
    carRect.right > hurdleRect.left &&
    carRect.top < hurdleRect.bottom &&
    carRect.bottom > hurdleRect.top;

  if (overlap && !gameOverCooldown) {
    gameOverCooldown = true;
    scoreBox.textContent = "OUCH! Score reset";
    showOuch();

    // Restart pothole pointer/animation from the beginning
    hurdle.style.animation = "none";
    void hurdle.offsetWidth;
    hurdle.style.animation = "";

    setTimeout(() => {
      resetScore();
      gameOverCooldown = false;
    }, 850);
  }

  const hurdleX = hurdleRect.left;
  if (lastHurdleX !== null && lastHurdleX > carRect.right && hurdleX <= carRect.right && !overlap) {
    score += 1;
    scoreBox.textContent = `Score: ${score}`;
  }
  lastHurdleX = hurdleX;

  requestAnimationFrame(gameLoop);
}

gameLoop();


function hideMobileHint(){
  const hint=document.getElementById('mobileJumpHint');
  if(hint){hint.style.display='none';}
}

document.addEventListener('keydown',(e)=>{
  if(e.code==='Space'){hideMobileHint();}
});

if(gameArea){
  gameArea.addEventListener('click',hideMobileHint);
}
