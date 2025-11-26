/* Hent data fra localStorage */
let score = Number(localStorage.getItem("score")) || 0;
let clickValue = Number(localStorage.getItem("clickValue")) || 1;
let autoClickers = Number(localStorage.getItem("autoClickers")) || 0;

/* Find HTML-elementer via querySelector */
const scoreText = document.querySelector("#score");
const clickButton = document.querySelector("#clickButton");
const clickValueText = document.querySelector("#clickValueText");
const buyAuto = document.querySelector("#buyAuto");
const buyBetter = document.querySelector("#buyBetter");
const resetBtn = document.querySelector("#resetBtn");
const musicToggle = document.querySelector("#musicToggle");

/* Lyde */
const clickSound = document.querySelector("#clickSound");
const upgradeSound = document.querySelector("#upgradeSound");
const bgMusic = document.querySelector("#bgMusic");

/* Opdaterer teksten i spillet */
function updateUI() {
  if (scoreText) scoreText.textContent = "Score: " + score;
  if (clickValueText)
    clickValueText.textContent = "+" + clickValue + " per click";
}
updateUI();

/* Gemmer spil-data */
function saveGame() {
  localStorage.setItem("score", score);
  localStorage.setItem("clickValue", clickValue);
  localStorage.setItem("autoClickers", autoClickers);
}

/* Når man klikker på gorillaen */
if (clickButton) {
  clickButton.addEventListener("click", () => {
    score += clickValue;
    updateUI();
    saveGame();

    /* Afspil klik-lyd */
    clickSound.play().catch(() => {});

    /* Lille hop-animation */
    clickButton.classList.add("bounce");
    setTimeout(() => clickButton.classList.remove("bounce"), 150);
  });
}

/* Auto-clicker giver point automatisk hvert sekund */
setInterval(() => {
  if (autoClickers > 0) {
    score += autoClickers;
    updateUI();
    saveGame();
  }
}, 1000);

/* Køb Auto Clicker */
if (buyAuto) {
  buyAuto.addEventListener("click", () => {
    if (score >= 20) {
      score -= 20;
      autoClickers++;
      upgradeSound.play().catch(() => {});
      updateUI();
      saveGame();
    }
  });
}

/* Køb Better Clicks */
if (buyBetter) {
  buyBetter.addEventListener("click", () => {
    if (score >= 50) {
      score -= 50;
      clickValue++;
      upgradeSound.play().catch(() => {});
      updateUI();
      saveGame();
    }
  });
}

/* Reset spillet */
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (confirm("Reset everything?")) {
      score = 0;
      clickValue = 1;
      autoClickers = 0;
      updateUI();
      saveGame();
    }
  });
}

/* Musik-knap */
if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicToggle.textContent = "Music: ON";
    } else {
      bgMusic.pause();
      musicToggle.textContent = "Music: OFF";
    }
  });
}

/* ============================================================
   FETCH AF GLOBAL HIGHSCORE (PENSUM-API)
   Kører kun på forsiden (index), fordi elementet ellers ikke findes
   ============================================================ */

const globalScoreBox = document.querySelector("#globalHighscore");

if (globalScoreBox) {
  fetch("scores.json")
    .then((response) => response.json())
    .then((data) => {
      globalScoreBox.textContent = "Global jungle-highscore: " + data.bestScore;
    })
    .catch(() => {
      globalScoreBox.textContent = "Kunne ikke hente global highscore.";
    });
}
