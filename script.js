// ============ NAVBAR: scroll style, mobile menu, active link ============
const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  let current = "home";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
  });
  links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
});

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.textContent = open ? "✕" : "☰";
});
links.forEach((l) =>
  l.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.textContent = "☰";
  })
);

// ============ THEME TOGGLE (remembers choice) ============
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeToggle.textContent = theme === "light" ? "☀️" : "🌙";
}

let savedTheme = "dark";
try { savedTheme = localStorage.getItem("theme") || "dark"; } catch (e) {}
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next = document.body.classList.contains("light") ? "dark" : "light";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ============ TYPING EFFECT ============
const roles = [
  "Software Engineer in the making",
  "Web Developer",
  "Problem Solver",
  "Lifelong Learner",
];
const typedEl = document.getElementById("typed");
let roleIdx = 0, charIdx = 0, deleting = false;

function type() {
  const word = roles[roleIdx];
  typedEl.textContent = word.substring(0, charIdx);

  if (!deleting && charIdx < word.length) {
    charIdx++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1500);
  } else if (charIdx > 0) {
    charIdx--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    roleIdx = (roleIdx + 1) % roles.length;
    setTimeout(type, 300);
  }
}
type();

// ============ SCROLL REVEAL + SKILL BARS + COUNTERS ============
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      el.querySelectorAll(".fill").forEach((bar) => (bar.style.width = bar.dataset.level + "%"));
      el.querySelectorAll("[data-count]").forEach(animateCount);

      observer.unobserve(el);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ============ CONTACT FORM (validation + opens email app) ============
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");
const MY_EMAIL = "251-35-092@gmail.com";

function setError(input, msg) {
  const field = input.closest(".field");
  field.classList.toggle("invalid", !!msg);
  field.querySelector(".error").textContent = msg;
  return !msg;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name;
  const email = form.email;
  const message = form.message;

  const okName = setError(name, name.value.trim().length < 2 ? "Please enter your name." : "");
  const okEmail = setError(
    email,
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Please enter a valid email."
  );
  const okMsg = setError(message, message.value.trim().length < 10 ? "Message should be at least 10 characters." : "");

  if (!(okName && okEmail && okMsg)) {
    note.textContent = "";
    return;
  }

  const subject = encodeURIComponent("Portfolio message from " + name.value.trim());
  const body = encodeURIComponent(
    message.value.trim() + "\n\n— " + name.value.trim() + " (" + email.value.trim() + ")"
  );
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;

  note.textContent = "Thanks! Your email app should open to send the message.";
  form.reset();
});

// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();
