// Google Sheets Tracking
const SHEET_URL = "https://script.google.com/macros/s/AKfycbx5Hc1cE5qTwJHoSXaVhEfD6K2BJBLS5KQIMGv9dH0Ip5UOZSSnud-m-otXlq5PYW5I/exec";

let currentName = "";
let noCount = 0;
let yesCount = 0;
let startTime = null;

function trackAction(action) {
  if (action === "no") noCount++;
  if (action === "yes") yesCount++;
}

function sendToSheet() {
  const durationSecs = startTime ? Math.round((new Date() - startTime) / 1000) : 0;
  const params = new URLSearchParams({
    name: currentName,
    noCount: noCount,
    yesCount: yesCount,
    duration: durationSecs,
  });
  fetch(`${SHEET_URL}?${params}`, { mode: "no-cors" })
    .catch(err => console.log("Tracking error:", err));
}

// Elements
const yesBtn = document.querySelector(".yes-button");
const noBtn = document.querySelector(".no-button");
const text = document.getElementById("text");
const img = document.getElementById("img");

const giftBtn = document.getElementById("gift");


const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

const card = document.getElementById("card");
const mainApp = document.getElementById("mainApp");

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music");
const themeBtn = document.getElementById("theme");

// Lock Screen Elements
const lockScreen = document.getElementById("lockScreen");
const nameInput = document.getElementById("nameInput");
const lockSubmit = document.getElementById("lockSubmit");
const lockError = document.getElementById("lockError");

// State
const savedPref = localStorage.getItem("musicOn");
let musicOn = savedPref === null ? true : JSON.parse(savedPref);
let step = 0;
let heartsStarted = false;
let loopCount = 1;
let multiplier = 4;

const validNames = ["Thủy", "thủy", "thỉ", "Thỉ", "thuyzan", "tzan", "Thuyzan", "Tzan"];

function checkName() {
  const name = nameInput.value.trim();

  if (validNames.includes(name)) {
    currentName = name;
    startTime = new Date();
    lockScreen.style.display = "none";
    mainApp.style.display = "";
    if (musicOn) playMusic();
  } else {
    lockError.innerText = "Bạn không phải là người ấy rồi 😢";
    nameInput.value = "";
    nameInput.focus();
  }
}

lockSubmit.addEventListener("click", checkName);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") checkName();
});

function updateMusicIcon() {
  musicBtn.innerText = music.paused ? "🔊" : "🔈";
}

function playMusic() {
  music.play().then(() => {
    musicOn = true;
    localStorage.setItem("musicOn", "true");
    updateMusicIcon();
  }).catch(err => {
    console.log("Music blocked:", err);
    musicOn = false;
    updateMusicIcon();
  });
}

function pauseMusic() {
  music.pause();
  musicOn = false;
  localStorage.setItem("musicOn", "false");
  updateMusicIcon();
}

window.addEventListener("load", () => {
  updateMusicIcon();
});

musicBtn.addEventListener("click", () => {
  if (music.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});


const stepsData = [
  { text: "Suy nghĩ lại đi mà 🤔", image: "assets/think.gif" },
  { text: "Hoi nghĩ lại thêm lần nữa đi 😢", image: "assets/sadface.gif" },
  { text: "Thoi mà... 🥺", image: "assets/plz.gif" },
  { text: "Ơ vẫn là không hả.. 😭", image: "assets/cry.gif" },
  { text: "Thoi mà người đẹp ơi 😍", image: "assets/cute.gif" },
  { text: `x${multiplier} năn nỉ ❤️`, image: "assets/loveme.gif" }
];

noBtn.addEventListener("click", () => {
  if (step < stepsData.length) {
    // Update last step text with current multiplier
    if (step === stepsData.length - 1) {
      stepsData[stepsData.length - 1].text = `x${multiplier} năn nỉ ❤️`;
    }

    text.innerText = stepsData[step].text;
    img.style.backgroundImage = `url(${stepsData[step].image})`;
    step++;
    trackAction("no");
  } else {
    // End of a loop — increase multiplier and check exit
    if (multiplier >= 1000) {
      text.innerText = "Tạm biệt 😭💔";
      img.style.backgroundImage = "url(assets/cry.gif)";
      yesBtn.style.display = "none";
      noBtn.style.display = "none";
      setTimeout(() => {
        window.close();
        // Fallback if window.close() is blocked
        document.body.innerHTML = `
          <div style="display:flex;justify-content:center;align-items:center;height:100vh;text-align:center;color:white;font-family:Poppins,sans-serif;">
            <div>
              <p style="font-size:48px;">💔</p>
              <p style="font-size:20px;margin-top:20px;">Tạm biệt...</p>
            </div>
          </div>
        `;
      }, 2000);
      return;
    }

    // Increase multiplier exponentially
    if (multiplier === 4) multiplier = 10;
    else if (multiplier === 10) multiplier = 100;
    else if (multiplier === 100) multiplier = 1000;

    loopCount++;
    step = 0; // Reset to first step
  }
});

// No button runs away
function moveNoButton() {
  const x = Math.random() * 140 - 70;
  const y = Math.random() * 100 - 50;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);

yesBtn.addEventListener("click", acceptLove);

function acceptLove() {
  trackAction("yes");
  sendToSheet();
  text.innerText = "Tui biết bé sẽ đồng ý mà ❤️";
  img.style.backgroundImage = "url(assets/thanks.gif)";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";
  giftBtn.style.display = "block";

  confettiBurst();

  if (music.paused) {
    playMusic();
  }

  if (!heartsStarted) {
    startHearts();
    heartsStarted = true;
  }
}

giftBtn.addEventListener("click", () => {
  popup.style.display = "flex";
  confettiBurst();
});


closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

function startHearts() {
  setInterval(() => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.innerText = "💖";
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = Math.random() * 20 + 16 + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 4000);
  }, 280);
}

function confettiBurst() {
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.background = `hsl(${Math.random() * 360},100%,60%)`;
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = "-10px";
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 1500);
  }
}

const themes = ["#ff4ecd", "#00eaff", "#7CFF00", "#FFD700"];
let themeIndex = 0;

themeBtn.addEventListener("click", () => {
  card.style.boxShadow = `0 0 70px ${themes[themeIndex]}`;
  themeIndex = (themeIndex + 1) % themes.length;
});