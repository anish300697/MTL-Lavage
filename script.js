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
    playPotholeHitSound();

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

/* Level 9 GitHub Pages-safe mini-game sound.
   Uses original browser-generated audio, so no external audio file is needed. */
const musicToggle = document.getElementById("musicToggle");

let audioCtx = null;
let musicEnabled = false;
let musicTimer = null;
let masterGain = null;

const softNotes = [261.63, 329.63, 392.00, 493.88, 392.00, 329.63, 293.66, 349.23];
let noteIndex = 0;

function ensureAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.055;
    masterGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  return audioCtx;
}

function playSoftNote(freq) {
  const ctx = ensureAudioContext();
  if (!ctx || !masterGain) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.16, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.45);
}

function startGeneratedMusic() {
  const ctx = ensureAudioContext();
  if (!ctx || musicTimer) return;

  playSoftNote(softNotes[noteIndex % softNotes.length]);

  musicTimer = setInterval(() => {
    playSoftNote(softNotes[noteIndex % softNotes.length]);
    noteIndex += 1;
  }, 620);
}

function stopGeneratedMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function toggleMusic() {
  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    if (musicToggle) musicToggle.textContent = "🔊 Music On";
    startGeneratedMusic();
  } else {
    if (musicToggle) musicToggle.textContent = "🎵 Tap Music";
    stopGeneratedMusic();
  }
}

function playPotholeHitSound() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(95, now);
  osc.frequency.exponentialRampToValueAtTime(38, now + 0.28);

  gain.gain.setValueAtTime(0.22, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.36);
}

if (musicToggle) {
  musicToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMusic();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    ensureAudioContext();
    if (musicEnabled) startGeneratedMusic();
  }
});

if (gameArea) {
  gameArea.addEventListener("click", () => {
    ensureAudioContext();
    if (musicEnabled) startGeneratedMusic();
  });
}
