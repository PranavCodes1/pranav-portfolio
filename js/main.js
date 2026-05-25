/* =========================================================
   Pranav Paralkar — Portfolio JavaScript
   ========================================================= */

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursor = document.getElementById("cursor");
const ring   = document.getElementById("cursor-ring");
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateCursor() {
  cursor.style.left = mx + "px";
  cursor.style.top  = my + "px";
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top  = ry + "px";
  requestAnimationFrame(animateCursor);
})();


// ── MOBILE NAV ─────────────────────────────────────────────
const ham = document.getElementById("ham");
const mob = document.getElementById("mob-menu");

ham.addEventListener("click", () => {
  ham.classList.toggle("open");
  mob.classList.toggle("open");
});

function closeMob() {
  ham.classList.remove("open");
  mob.classList.remove("open");
}


// ── BACKGROUND CANVAS ──────────────────────────────────────
const canvas = document.getElementById("bg-canvas");
const ctx    = canvas.getContext("2d");
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Floating particle class
class Pt {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.32;
    this.vy = (Math.random() - 0.5) * 0.32;
    this.r  = Math.random() * 1.1 + 0.3;
    this.a  = Math.random() * 0.4 + 0.07;
    const c = Math.random();
    this.col = c > 0.65 ? "91,141,238" : c > 0.35 ? "167,139,250" : "52,211,153";
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.col},${this.a})`;
    ctx.fill();
  }
}

const pts = [];
for (let i = 0; i < 90; i++) pts.push(new Pt());

// Decorative hexagons
const hexes = [
  { x: 0.85, y: 0.18, r: 55, rot: 0,   spd: 0.003, col: "91,141,238",  a: 0.05  },
  { x: 0.08, y: 0.72, r: 38, rot: 1,   spd: 0.005, col: "167,139,250", a: 0.055 },
  { x: 0.93, y: 0.78, r: 28, rot: 0.5, spd: 0.007, col: "52,211,153",  a: 0.06  },
];

function drawHex(x, y, r, rot, col, a) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = rot + i * Math.PI / 3;
    i === 0
      ? ctx.moveTo(x + r * Math.cos(ang), y + r * Math.sin(ang))
      : ctx.lineTo(x + r * Math.cos(ang), y + r * Math.sin(ang));
  }
  ctx.closePath();
  ctx.strokeStyle = `rgba(${col},${a})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

let t = 0;
(function animateCanvas() {
  ctx.clearRect(0, 0, W, H);

  // subtle grid
  ctx.strokeStyle = "rgba(91,141,238,0.022)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 88) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 88) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  t += 0.01;
  hexes.forEach((h, i) => {
    h.rot += h.spd;
    const fy = h.y * H + Math.sin(t + i) * 9;
    drawHex(h.x * W, fy, h.r,        h.rot,       h.col, h.a);
    drawHex(h.x * W, fy, h.r * 0.6,  h.rot + 0.5, h.col, h.a * 0.6);
  });

  pts.forEach(p => { p.update(); p.draw(); });

  // connecting lines between nearby particles
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 85) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(91,141,238,${0.065 * (1 - d / 85)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateCanvas);
})();


// ── SCROLL REVEAL ──────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add("visible"), i * 65);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(".reveal").forEach(r => obs.observe(r));


// ── 3D TILT ON CARDS ───────────────────────────────────────
document.querySelectorAll(".project-card, .skill-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rc = card.getBoundingClientRect();
    const x  = e.clientX - rc.left  - rc.width  / 2;
    const y  = e.clientY - rc.top   - rc.height / 2;
    card.style.transform = `perspective(700px) rotateY(${x * 0.022}deg) rotateX(${-y * 0.022}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


// ── BLINKING TERMINAL CURSOR ───────────────────────────────
setInterval(() => {
  const b = document.getElementById("blink-cursor");
  if (b) b.style.opacity = b.style.opacity === "0" ? "1" : "0";
}, 580);
