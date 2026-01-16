let avstand = 500;
let hp = 100;
let kjort = 0;
let spillerIGang = false;

const statusTekst = document.getElementById("status");
const startSkjerm = document.getElementById("startskjerm");
const spill = document.getElementById("spill");
const startKnapp = document.getElementById("start-knapp");
const fyrverkeriCanvas = document.getElementById("fyrverkeri");
const ctx = fyrverkeriCanvas.getContext("2d");

const kortSkadeEl = document.getElementById("kort-skade");
const langSkadeEl = document.getElementById("lang-skade");
const kortAvstandEl = document.getElementById("kort-avstand");
const langAvstandEl = document.getElementById("lang-avstand");
const bilEl = document.getElementById("bil");

fyrverkeriCanvas.width = window.innerWidth;
fyrverkeriCanvas.height = window.innerHeight;

startKnapp.addEventListener("click", startSpill);
document.getElementById("kort-vei").addEventListener("click", () => kjør("kort"));
document.getElementById("lang-vei").addEventListener("click", () => kjør("lang"));

function startSpill() {
  avstand = 500;
  hp = 100;
  kjort = 0;
  spillerIGang = true;
  startSkjerm.classList.add("skjult");
  spill.classList.remove("skjult");
  oppdaterStatus();
  oppdaterKart();
  visTilfeldigeVerdier();
}

function visTilfeldigeVerdier() {
  // Kort vei = lite stykke, moderat skade
  kortSkadeEl.textContent = Math.floor(Math.random() * 5) + 1; // 1–5 skade
  kortAvstandEl.textContent = Math.floor(Math.random() * 16) + 5; // 5–20 km

  // Lang vei = langt stykke, mye skade
  langSkadeEl.textContent = Math.floor(Math.random() * 8) + 3; // 3–10 skade
  langAvstandEl.textContent = Math.floor(Math.random() * 21) + 25; // 25–45 km
}

function kjør(type) {
  if (!spillerIGang) return;

  let skade = 0;
  let distanse = 0;

  if (type === "kort") {
    skade = parseInt(kortSkadeEl.textContent);
    distanse = parseInt(kortAvstandEl.textContent);
  } else {
    skade = parseInt(langSkadeEl.textContent);
    distanse = parseInt(langAvstandEl.textContent);
  }

  hp -= skade;
  kjort += distanse;
  avstand -= distanse;
  oppdaterKart();

  if (hp <= 0) {
    hp = 0;
    statusTekst.innerHTML = `💥 Bilen gikk i stykker! Du må starte på nytt.`;
    setTimeout(tilbakeTilStart, 2500);
    return;
  }

  if (avstand <= 0) {
    statusTekst.innerHTML = `🎉 Du kom fram til hytta! Fyrverkeri starter!`;
    startFyrverkeri();
    setTimeout(() => {
      stoppFyrverkeri();
      tilbakeTilStart();
    }, 10000);
    return;
  }

  oppdaterStatus();
  visTilfeldigeVerdier(); // nye tilfeldige verdier for neste valg
}

function oppdaterStatus() {
  statusTekst.innerHTML = `
    🚗 Kjørt: <strong>${Math.min(500, kjort)}</strong> km / 500 km<br>
    ❤️ HP igjen: <strong>${hp}</strong><br>
    📏 Avstand igjen: <strong>${Math.max(0, avstand)}</strong> km
  `;
}

function oppdaterKart() {
  const prosent = Math.min(100, (kjort / 500) * 100);
  bilEl.style.left = prosent + "%";
}

function tilbakeTilStart() {
  spillerIGang = false;
  spill.classList.add("skjult");
  startSkjerm.classList.remove("skjult");
}

// ===== Fyrverkeri =====
let partikler = [];
let fyrverkeriTimer;

function startFyrverkeri() {
  fyrverkeriCanvas.classList.remove("skjult");
  partikler = [];
  fyrverkeriTimer = setInterval(lagFyrverkeri, 100);
  requestAnimationFrame(tegnFyrverkeri);
}

function stoppFyrverkeri() {
  fyrverkeriCanvas.classList.add("skjult");
  clearInterval(fyrverkeriTimer);
}

function lagFyrverkeri() {
  for (let i = 0; i < 20; i++) {
    partikler.push({
      x: Math.random() * fyrverkeriCanvas.width,
      y: Math.random() * fyrverkeriCanvas.height,
      farge: `hsl(${Math.random() * 360}, 100%, 60%)`,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      liv: 100
    });
  }
}

function tegnFyrverkeri() {
  ctx.clearRect(0, 0, fyrverkeriCanvas.width, fyrverkeriCanvas.height);
  partikler.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.farge;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    p.liv -= 2;
  });
  partikler = partikler.filter((p) => p.liv > 0);
  requestAnimationFrame(tegnFyrverkeri);
}
