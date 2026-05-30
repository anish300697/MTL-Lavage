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

/* Level 10 reliable mini-game audio.
   Original no-copyright Web Audio. No audio files required.
   Click "Sound Off" or tap the game area once to enable sound. */
const musicToggle = document.getElementById("musicToggle");

let mtllAudioCtx = null;
let mtllSoundEnabled = false;
let mtllMusicLoop = null;
let mtllStep = 0;
let mtllMaster = null;

const mtllMelody = [261.63, 329.63, 392.00, 329.63, 293.66, 349.23, 392.00, 493.88];

function initMtllAudio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;

  if (!mtllAudioCtx) {
    mtllAudioCtx = new AC();
    mtllMaster = mtllAudioCtx.createGain();
    mtllMaster.gain.value = 0.06;
    mtllMaster.connect(mtllAudioCtx.destination);
  }

  if (mtllAudioCtx.state === "suspended") {
    mtllAudioCtx.resume();
  }

  return mtllAudioCtx;
}

function showSoundToast(text) {
  if (!gameArea) return;
  const old = gameArea.querySelector(".sound-toast");
  if (old) old.remove();

  const toast = document.createElement("div");
  toast.className = "sound-toast";
  toast.textContent = text;
  gameArea.appendChild(toast);
  setTimeout(() => toast.remove(), 1200);
}

function playMusicNote() {
  const ctx = initMtllAudio();
  if (!ctx || !mtllMaster || !mtllSoundEnabled) return;

  const now = ctx.currentTime;
  const freq = mtllMelody[mtllStep % mtllMelody.length];
  mtllStep++;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

  osc.connect(gain);
  gain.connect(mtllMaster);
  osc.start(now);
  osc.stop(now + 0.5);
}

function startMtllMusic() {
  initMtllAudio();
  if (mtllMusicLoop) return;
  playMusicNote();
  mtllMusicLoop = setInterval(playMusicNote, 620);
}

function stopMtllMusic() {
  if (mtllMusicLoop) {
    clearInterval(mtllMusicLoop);
    mtllMusicLoop = null;
  }
}

function enableMtllSound() {
  mtllSoundEnabled = true;
  if (musicToggle) musicToggle.textContent = "🔊 Sound On";
  startMtllMusic();
}

function disableMtllSound() {
  mtllSoundEnabled = false;
  if (musicToggle) musicToggle.textContent = "🔈 Sound Off";
  stopMtllMusic();
}

function toggleMtllSound() {
  initMtllAudio();
  if (mtllSoundEnabled) {
    disableMtllSound();
    showSoundToast("Sound Off");
  } else {
    enableMtllSound();
    showSoundToast("Sound On");
  }
}

function playPotholeHitSound() {
  const ctx = initMtllAudio();
  if (!ctx || !mtllSoundEnabled) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.3);
}

if (musicToggle) {
  musicToggle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMtllSound();
  });
}

if (gameArea) {
  gameArea.addEventListener("pointerdown", () => {
    initMtllAudio();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    initMtllAudio();
  }
});
