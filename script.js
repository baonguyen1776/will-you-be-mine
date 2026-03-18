// Elements
const yesBtn = document.querySelector(".yes-button");
const noBtn = document.querySelector(".no-button");
const text = document.getElementById("text");
const img = document.getElementById("img");

const giftBtn = document.getElementById("gift");
const cover = document.getElementById("cover");

const popup = document.getElementById("popup");
const closePopup = document.getElementById("close-popup");

const card = document.getElementById("card");

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music");
const themeBtn = document.getElementById("theme");

// State
const savedPref = localStorage.getItem("musicOn");
let musicOn = savedPref === null ? true : JSON.parse(savedPref);
let step = 0;
let heartsStarted = false;
let firstClickDone = false;

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
  if (musicOn) {
    playMusic();
  } else {
    pauseMusic();
  }
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
  { text: "x4 năn nỉ ❤️", image: "assets/loveme.gif" }
];

noBtn.addEventListener("click", () => {
  if (step < stepsData.length) {
    text.innerText = stepsData[step].text;
    img.style.backgroundImage = `url(${stepsData[step].image})`;
    step++;
  } else {
    acceptLove();
  }
});

function moveNoButton() {
  const x = Math.random() * 140 - 70;
  const y = Math.random() * 100 - 50;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", moveNoButton);

// Yes Button
yesBtn.addEventListener("click", acceptLove);

function acceptLove() {
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

// Gift & Popup
giftBtn.addEventListener("click", () => {
  cover.style.display = "flex";
});

cover.addEventListener("click", () => {
  cover.style.display = "none";
  popup.style.display = "flex";
  confettiBurst();
});

closePopup.addEventListener("click", () => {
  popup.style.display = "none";
});

// Floating Hearts
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

// Confetti
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

// Theme
const themes = ["#ff4ecd", "#00eaff", "#7CFF00", "#FFD700"];
let themeIndex = 0;

themeBtn.addEventListener("click", () => {
  card.style.boxShadow = `0 0 70px ${themes[themeIndex]}`;
  themeIndex = (themeIndex + 1) % themes.length;
});